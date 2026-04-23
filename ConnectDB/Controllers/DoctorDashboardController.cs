using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using ConnectDB.Enums;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = AppRoles.Doctor)]
    public class DoctorDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DoctorDashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            
            if (doctor == null) 
            {
                // Self-healing fallback: Trả về dữ liệu trống thay vì 404 để giao diện không bị crash
                return Ok(new DoctorDashboardStatsDto
                {
                    TotalPatients = 0,
                    AppointmentsToday = 0,
                    PriorityCases = 0,
                    CompletedToday = 0,
                    PatientGrowth = 0
                });
            }

            var today = DateTime.Today;

            // 1. Tổng bệnh nhân (duy nhất) đã từng đặt khám với bác sĩ này
            var totalPatients = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id)
                .Select(a => a.PatientId)
                .Distinct()
                .CountAsync();

            // 2. Lịch hẹn hôm nay
            var appointmentsToday = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id && a.AppointmentTime.Date == today)
                .CountAsync();

            // 3. Số ca đã hoàn thành hôm nay
            var completedToday = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id && a.AppointmentTime.Date == today && a.Status == "Completed")
                .CountAsync();

            // 4. Ca ưu tiên (giả lập logic: Các ca có ghi chú khẩn cấp hoặc trạng thái CheckIn sớm)
            var priorityCases = await _context.Appointments
                .Where(a => a.DoctorId == doctor.Id && a.AppointmentTime.Date == today && a.Status == "CheckedIn")
                .CountAsync();

            return Ok(new DoctorDashboardStatsDto
            {
                TotalPatients = totalPatients,
                AppointmentsToday = appointmentsToday,
                PriorityCases = priorityCases,
                CompletedToday = completedToday,
                PatientGrowth = 12.5 // Mock data for growth
            });
        }

        [HttpGet("recent-appointments")]
        public async Task<IActionResult> GetRecentAppointments()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var doctor = await _context.Doctors.FirstOrDefaultAsync(d => d.UserId == userId);
            
            if (doctor == null) 
            {
                return Ok(new List<object>()); // Trả về list rỗng
            }

            var appointments = await _context.Appointments
                .Include(a => a.Patient)
                .Where(a => a.DoctorId == doctor.Id)
                .OrderByDescending(a => a.AppointmentTime)
                .Take(5)
                .Select(a => new {
                    a.Id,
                    PatientName = a.Patient != null ? a.Patient.FullName : "N/A",
                    PatientId = a.Patient != null ? $"BN-{a.Patient.Id:D4}" : "N/A",
                    Time = a.AppointmentTime.ToString("HH:mm"),
                    Reason = "Khám tổng quát", // Mock logic
                    Status = a.Status,
                    ImageUrl = a.Patient != null ? "" : "" // Patient image placeholder
                })
                .ToListAsync();

            return Ok(appointments);
        }
    }
}
