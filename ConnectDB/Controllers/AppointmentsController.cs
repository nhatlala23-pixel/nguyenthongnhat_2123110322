using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using System.Security.Claims;

using ConnectDB.Services;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AppointmentsController : ControllerBase
    {
        private readonly IAppointmentService _appointmentService;

        public AppointmentsController(IAppointmentService appointmentService)
        {
            _appointmentService = appointmentService;
        }

        // 1. Patient đặt lịch
        [HttpPost]
        [Authorize(Roles = "Patient")]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentCreateDto model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var appointmentId = await _appointmentService.BookAppointmentAsync(userId, model);

            if (appointmentId == null) return BadRequest("Patient profile not found");

            return Ok(new { message = "Appointment booked successfully", appointmentId = appointmentId });
        }

        // 2. Receptionist xác nhận lịch
        [HttpPatch("{id}/confirm")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            var success = await _appointmentService.ConfirmAppointmentAsync(id);
            if (!success) return NotFound();

            return Ok("Appointment confirmed");
        }

        // 3. Receptionist Check-in
        [HttpPatch("{id}/checkin")]
        [Authorize(Roles = "Receptionist")]
        public async Task<IActionResult> CheckIn(int id)
        {
            var success = await _appointmentService.CheckInAsync(id);
            if (!success) return NotFound();

            return Ok("Patient checked in");
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAppointments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var appointments = await _appointmentService.GetAppointmentsAsync(userId, userRole);
            return Ok(appointments);
        }

        // 4. Xem chi tiết 1 lịch hẹn
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var appointment = await _appointmentService.GetAppointmentByIdAsync(id, userId, userRole);
            if (appointment == null) return NotFound();

            return Ok(appointment);
        }

        // 5. Cập nhật lịch hẹn
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutAppointment(int id, [FromBody] AppointmentUpdateDto model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var success = await _appointmentService.UpdateAppointmentAsync(id, userId, userRole, model);
            if (!success) return Forbid(); // Or NotFound based on service logic

            return Ok("Appointment updated successfully");
        }

        // 6. Xóa/Hủy lịch hẹn (Xóa cứng - Chỉ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var success = await _appointmentService.DeleteAppointmentAsync(id, userId, userRole);
            if (!success) return Forbid("Không có quyền xóa lịch hẹn hoặc lịch hẹn không tồn tại.");

            return Ok("Appointment deleted permanently.");
        }

        // 7. Bệnh nhân chủ động Hủy lịch hẹn
        [HttpPatch("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var success = await _appointmentService.CancelAppointmentAsync(id, userId, userRole);
            if (!success) return BadRequest("Không thể hủy lịch khám. Lịch khám này có thể không tồn tại, của người khác, hoặc đã qua trạng thái chờ xác nhận.");

            return Ok("Đã hủy lịch khám thành công.");
        }
    }


}

