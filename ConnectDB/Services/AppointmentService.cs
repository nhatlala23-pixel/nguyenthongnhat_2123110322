using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
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

        public async Task<int?> BookAppointmentAsync(int userId, AppointmentCreateDto model)
        {
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return null;

            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = model.DoctorId,
                AppointmentTime = model.AppointmentTime,
                Status = "Pending"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return appointment.Id;
        }

        public async Task<bool> ConfirmAppointmentAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CheckInAsync(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return false;

            appointment.Status = "CheckedIn";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<Appointment>> GetAppointmentsAsync(int userId, string role)
        {
            var query = _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).AsQueryable();

            if (role == "Admin" || role == "Doctor" || role == "Receptionist")
            {
                return await query.ToListAsync();
            }

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return Enumerable.Empty<Appointment>();

            return await query.Where(a => a.PatientId == patient.Id).ToListAsync();
        }

        public async Task<Appointment?> GetAppointmentByIdAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null) return null;

            if (role != "Admin" && role != "Doctor" && role != "Receptionist" && appointment.Patient?.UserId != userId)
            {
                return null;
            }

            return appointment;
        }

        public async Task<bool> UpdateAppointmentAsync(int id, int userId, string role, AppointmentUpdateDto model)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return false;

            if (role != "Admin" && appointment.Patient?.UserId != userId)
            {
                return false;
            }

            if (appointment.Status != "Pending" && role != "Admin")
            {
                return false;
            }

            appointment.DoctorId = model.DoctorId;
            appointment.AppointmentTime = model.AppointmentTime;
            
            if (role == "Admin" && !string.IsNullOrEmpty(model.Status))
            {
                appointment.Status = model.Status;
            }

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> CancelAppointmentAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return false;

            if (role != "Admin" && appointment.Patient?.UserId != userId)
            {
                return false;
            }

            // Bệnh nhân chỉ được hủy khi trạng thái là Pending
            if (role == "Patient" && appointment.Status != "Pending")
            {
                return false;
            }

            // Không thể hủy lịch đã hoàn thành hoặc đã bị hủy
            if (appointment.Status == "Completed" || appointment.Status == "Cancelled")
            {
                return false;
            }

            appointment.Status = "Cancelled";
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAppointmentAsync(int id, int userId, string role)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return false;

            // Xóa cứng: chỉ dành cho Admin hoặc nội bộ (trong app này chỉ cho Admin cho an toàn)
            if (role != "Admin")
            {
                return false;
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
