using ConnectDB.Data;
using ConnectDB.DTOs;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public interface IDashboardService
    {
        Task<AdminDashboardDto> GetAdminDashboardStatsAsync();
    }

    public class DashboardService : IDashboardService
    {
        private readonly AppDbContext _context;

        public DashboardService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<AdminDashboardDto> GetAdminDashboardStatsAsync()
        {
            var today = DateTime.Today;

            var totalDoctors = await _context.Doctors.CountAsync();
            var totalPatients = await _context.Patients.CountAsync();
            var todayAppointments = await _context.Appointments.CountAsync(a => a.AppointmentTime.Date == today);

            var recentAppointments = await _context.Appointments
                .Include(a => a.Patient)
                .Include(a => a.Doctor)
                .OrderByDescending(a => a.AppointmentTime)
                .Take(5)
                .ToListAsync();

            var recentActivities = recentAppointments.Select(a => new RecentActivityDto
            {
                PatientName = a.Patient?.FullName ?? "N/A",
                PatientId = $"#{a.PatientId}",
                DoctorName = a.Doctor?.FullName ?? "N/A",
                Department = a.Doctor?.Specialization ?? "N/A",
                Time = a.AppointmentTime.ToString("HH:mm tt"),
                Status = a.Status
            }).ToList();

            return new AdminDashboardDto
            {
                TotalDoctors = totalDoctors,
                TotalPatients = totalPatients,
                TodayAppointments = todayAppointments,
                OperationEfficiency = 94.8, // Mocked for now
                RecentActivities = recentActivities
            };
        }
    }
}
