using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SchedulesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public SchedulesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/Schedules/doctor/5?date=2024-04-17
        [HttpGet("doctor/{doctorId}")]
        public async Task<ActionResult<IEnumerable<DoctorSchedule>>> GetDoctorSchedules(int doctorId, [FromQuery] DateTime date)
        {
            var startDate = date.Date;
            var endDate = startDate.AddDays(1);

            var schedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == doctorId && s.Date >= startDate && s.Date < endDate)
                .ToListAsync();

            return Ok(schedules);
        }

        // POST: api/Schedules/bulk
        [HttpPost("bulk")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> BulkUpdateSchedules([FromBody] ScheduleCreateDto model)
        {
            var startDate = model.Date.Date;
            var endDate = startDate.AddDays(1);

            // 1. Xóa các khung giờ cũ của bác sĩ đó trong ngày đó
            var oldSchedules = await _context.DoctorSchedules
                .Where(s => s.DoctorId == model.DoctorId && s.Date >= startDate && s.Date < endDate)
                .ToListAsync();

            _context.DoctorSchedules.RemoveRange(oldSchedules);

            // 2. Thêm các khung giờ mới
            var newSchedules = model.TimeSlots.Select(slot => new DoctorSchedule
            {
                DoctorId = model.DoctorId,
                Date = startDate,
                TimeSlot = slot,
                IsAvailable = true
            }).ToList();

            _context.DoctorSchedules.AddRange(newSchedules);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Cập nhật lịch khám thành công", count = newSchedules.Count });
        }
    }
}
