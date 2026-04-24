using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using ConnectDB.Enums;
using ConnectDB.Helpers;
using System.Security.Claims;

using ConnectDB.Services;
using System.Threading.Tasks;

namespace ConnectDB.Controllers
{
    [Route("api/appointments")]
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
        [Authorize(Roles = AppRoles.Patient)]
        public async Task<IActionResult> BookAppointment([FromBody] AppointmentCreateDto model)
        {
            try 
            {
                var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
                var result = await _appointmentService.BookAppointmentAsync(userId, model);
                
                return Ok(new { 
                    message = "Appointment booked successfully", 
                    appointmentId = result.appointmentId,
                    invoiceId = result.invoiceId
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Lỗi hệ thống khi tạo lịch hẹn: " + ex.Message, detail = ex.InnerException?.Message });
            }
        }

        // 2. Receptionist/Admin xác nhận lịch
        [HttpPatch("{id}/confirm")]
        [Authorize(Roles = "Admin,Receptionist")]
        public async Task<IActionResult> ConfirmAppointment(int id)
        {
            await _appointmentService.ConfirmAppointmentAsync(id);
            return Ok(new { message = "Appointment confirmed" });
        }

        // 3. Receptionist/Admin/Doctor Check-in
        [HttpPatch("{id}/checkin")]
        [Authorize(Roles = "Admin,Receptionist,Doctor")]
        public async Task<IActionResult> CheckIn(int id)
        {
            await _appointmentService.CheckInAsync(id);
            return Ok(new { message = "Patient checked in" });
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetAppointments([FromQuery] int pageIndex = 1, [FromQuery] int pageSize = 10)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var appointments = await _appointmentService.GetAppointmentsAsync(userId, userRole, pageIndex, pageSize);
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
            return Ok(appointment);
        }

        // 5. Cập nhật lịch hẹn
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutAppointment(int id, [FromBody] AppointmentUpdateDto model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            await _appointmentService.UpdateAppointmentAsync(id, userId, userRole, model);
            return Ok(new { message = "Appointment updated successfully" });
        }

        // 6. Xóa/Hủy lịch hẹn (Xóa cứng - Chỉ Admin)
        [HttpDelete("{id}")]
        [Authorize(Roles = AppRoles.Admin)]
        public async Task<IActionResult> DeleteAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            await _appointmentService.DeleteAppointmentAsync(id, userId, userRole);
            return Ok(new { message = "Appointment deleted permanently." });
        }

        // 7. Bệnh nhân chủ động Hủy lịch hẹn
        [HttpPatch("{id}/cancel")]
        [Authorize]
        public async Task<IActionResult> CancelAppointment(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            await _appointmentService.CancelAppointmentAsync(id, userId, userRole);
            return Ok(new { message = "Đã hủy lịch khám thành công." });
        }
    }
}

