using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using System.Security.Claims;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AppointmentsController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Patient đặt lịch
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentCreateDto model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);

            if (patient == null) return BadRequest("Patient profile not found");

            var appointment = new Appointment
            {
                PatientId = patient.Id,
                DoctorId = model.DoctorId,
                AppointmentTime = model.AppointmentTime,
                Status = "Pending"
            };

            _context.Appointments.Add(appointment);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Appointment booked successfully", appointmentId = appointment.Id });
        }

        // 2. Receptionist xác nhận lịch
        [HttpPatch("{id}/confirm")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.Status = "Confirmed";
            await _context.SaveChangesAsync();

            return Ok("Appointment confirmed");
        }

        // 3. Receptionist Check-in
        [HttpPatch("{id}/checkin")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> CheckIn(int id)
        {
            var appointment = await _context.Appointments.FindAsync(id);
            if (appointment == null) return NotFound();

            appointment.Status = "CheckedIn";
            await _context.SaveChangesAsync();

            return Ok("Patient checked in");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole == "Admin" || userRole == "Doctor" || userRole == "Receptionist")
            {
                return Ok(await _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).ToListAsync());
            }

            // Bệnh nhân chỉ thấy lịch của mình
            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound("Patient profile not found");

            return Ok(await _context.Appointments
                .Where(a => a.PatientId == patient.Id)
                .Include(a => a.Doctor)
                .ToListAsync());
        }

        // 4. Xem chi tiết 1 lịch hẹn
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var appointment = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .FirstOrDefaultAsync(a => a.Id == id);

            if (appointment == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && userRole != "Doctor" && userRole != "Receptionist" && appointment.Patient?.UserId != userId)
            {
                return Forbid();
            }

            return Ok(appointment);
        }

        // 5. Cập nhật lịch hẹn (Patient đổi lịch/bác sĩ khi còn Pending)
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutAppointment(int id, [FromBody] AppointmentUpdateDto model)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            // Kiểm tra quyền
            if (userRole != "Admin" && appointment.Patient?.UserId != userId)
            {
                return Forbid();
            }

            // Chỉ cho phép sửa khi trạng thái là Pending
            if (appointment.Status != "Pending" && userRole != "Admin")
            {
                return BadRequest("Cannot change appointment that is not in Pending status.");
            }

            appointment.DoctorId = model.DoctorId;
            appointment.AppointmentTime = model.AppointmentTime;
            
            if (userRole == "Admin" && !string.IsNullOrEmpty(model.Status))
            {
                appointment.Status = model.Status;
            }

            await _context.SaveChangesAsync();
            return Ok("Appointment updated successfully");
        }

        // 6. Xóa/Hủy lịch hẹn
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var appointment = await _context.Appointments.Include(a => a.Patient).FirstOrDefaultAsync(a => a.Id == id);
            if (appointment == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && appointment.Patient?.UserId != userId)
            {
                return Forbid();
            }

            // Nếu là bệnh nhân, chỉ được xóa khi chưa khám (Pending hoặc Confirmed)
            if (userRole == "Patient" && appointment.Status == "Completed")
            {
                return BadRequest("Cannot cancel a completed appointment.");
            }

            _context.Appointments.Remove(appointment);
            await _context.SaveChangesAsync();

            return Ok("Appointment deleted/cancelled");
        }
    }

    public class AppointmentCreateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentTime { get; set; }
    }

    public class AppointmentUpdateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentTime { get; set; }
        public string? Status { get; set; } // Admin có thể đổi status trực tiếp
    }
}

