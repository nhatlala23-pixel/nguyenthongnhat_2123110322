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
            return Ok(await _context.Appointments.Include(a => a.Patient).Include(a => a.Doctor).ToListAsync());
        }
    }

    public class AppointmentCreateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentTime { get; set; }
    }
}

