using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
using ConnectDB.Enums;
using ConnectDB.Exceptions;
using ConnectDB.Helpers;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public class AppointmentService : IAppointmentService
    {
        private readonly AppDbContext _context;

        public AppointmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<(int appointmentId, int invoiceId)> BookAppointmentAsync(int userId, AppointmentCreateDto model)
        {
            // Tăng thời gian chờ cho Database để tránh lỗi Timeout
            _context.Database.SetCommandTimeout(60);

            // 1. Lấy thông tin Bệnh nhân và Bác sĩ cùng lúc
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            var doctor = await _context.Doctors.AsNoTracking().FirstOrDefaultAsync(d => d.Id == model.DoctorId);

            if (doctor == null) throw new Exception("Không tìm thấy thông tin bác sĩ");

            // 2. Nếu chưa có hồ sơ bệnh nhân, tạo mới ngay
            if (patient == null)
            {
                var user = await _context.Users.FindAsync(userId);
                patient = new Patient 
                { 
                    UserId = userId, 
                    FullName = user?.Username ?? "Patient " + userId 
                };
                _context.Patients.Add(patient);
                await _context.SaveChangesAsync(); // Lưu bệnh nhân trước để có Id
            }

            // 3. Tạo Lịch hẹn và Hóa đơn trong cùng một đợt lưu
            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = model.DoctorId,
                AppointmentTime = model.AppointmentTime,
                Status = "Pending"
            };

            var invoice = new Invoice
            {
                Appointment = appointment,
                TotalAmount = doctor.ConsultationPrice ?? 50000,
                IsPaid = false,
                CreatedDate = DateTime.Now
            };

            _context.Appointments.Add(appointment);
            _context.Invoices.Add(invoice);

            await _context.SaveChangesAsync();

            return (appointment.Id, invoice.Id);
        }

        public async Task ConfirmAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) throw new NotFoundException("Appointment not found");

            appointment.Status = AppointmentStatus.Confirmed.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task CheckInAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) throw new NotFoundException("Appointment not found");

            appointment.Status = AppointmentStatus.CheckedIn.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task<PaginatedList<Appointment>> GetAppointmentsAsync(int userId, string role, int pageIndex = 1, int pageSize = 10)
        {
            var query = _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).AsQueryable();

            if (role == AppRoles.Patient)
            {
                var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
                
                // Nếu thiếu, trả về danh sách trống nhưng không báo lỗi 404
                if (patient == null) return new PaginatedList<Appointment>(new List<Appointment>(), 0, pageIndex, pageSize);
                
                query = query.Where(a => a.PatientId == patient.Id);
            }
            else if (role == AppRoles.Doctor)
            {
                var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
                if (doctor == null) return new PaginatedList<Appointment>(new List<Appointment>(), 0, pageIndex, pageSize);

                query = query.Where(a => a.DoctorId == doctor.Id);
            }

            return await PaginatedList<Appointment>.CreateAsync(query, pageIndex, pageSize);
        }

        public async Task<Appointment> GetAppointmentByIdAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null) throw new NotFoundException("Appointment not found");

            if (role != AppRoles.Admin && role != AppRoles.Doctor && role != AppRoles.Receptionist && appointment.Patient?.UserId != userId)
            {
                throw new ForbiddenException("You don't have permission to view this appointment");
            }

            return appointment;
        }

        public async Task UpdateAppointmentAsync(int id, int userId, string role, AppointmentUpdateDto model)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) throw new NotFoundException("Appointment not found");

            // Admin has full control, Others only if it's their own or they are the doctor
            if (role != AppRoles.Admin && role != AppRoles.Doctor && appointment.Patient?.UserId != userId)
            {
                throw new ForbiddenException("You don't have permission to update this appointment");
            }

            // Patients can only update if Pending
            if (role == AppRoles.Patient && appointment.Status != AppointmentStatus.Pending.ToString())
            {
                throw new BadRequestException("Cannot update an appointment that is already confirmed or completed");
            }

            if (model.DoctorId > 0) appointment.DoctorId = model.DoctorId;
            if (model.AppointmentTime != default) appointment.AppointmentTime = model.AppointmentTime;
            
            // Allow status update if Admin or Doctor (e.g., Doctor checking in)
            if ((role == AppRoles.Admin || role == AppRoles.Doctor) && !string.IsNullOrEmpty(model.Status))
            {
                appointment.Status = model.Status;
            }

            await _context.SaveChangesAsync();
        }

        public async Task CancelAppointmentAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) throw new NotFoundException("Appointment not found");

            if (role != AppRoles.Admin && appointment.Patient?.UserId != userId)
            {
                throw new ForbiddenException("You don't have permission to cancel this appointment");
            }

            // Bệnh nhân chỉ được hủy khi trạng thái là Pending
            if (role == AppRoles.Patient && appointment.Status != AppointmentStatus.Pending.ToString())
            {
                throw new BadRequestException("You can only cancel pending appointments");
            }

            // Không thể hủy lịch đã hoàn thành hoặc đã bị hủy
            if (appointment.Status == AppointmentStatus.Completed.ToString() || appointment.Status == AppointmentStatus.Cancelled.ToString())
            {
                throw new BadRequestException("Cannot cancel an already completed or cancelled appointment");
            }

            appointment.Status = AppointmentStatus.Cancelled.ToString();
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAppointmentAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) throw new NotFoundException("Appointment not found");

            if (role != AppRoles.Admin)
            {
                throw new ForbiddenException("Only administrators can permanently delete appointments");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
        }

        public async Task<Invoice?> GetInvoiceByAppointmentIdAsync(int appointmentId)
        {
            return await _context.Invoices.FirstOrDefaultAsync(i => i.AppointmentId == appointmentId);
        }
    }
}
