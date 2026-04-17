using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;
using ConnectDB.Helpers;

namespace ConnectDB.Services
{
    public interface IAppointmentService
    {
        Task<int> BookAppointmentAsync(int userId, AppointmentCreateDto model);
        Task ConfirmAppointmentAsync(int id);
        Task CheckInAsync(int id);
        Task<PaginatedList<Appointment>> GetAppointmentsAsync(int userId, string role, int pageIndex = 1, int pageSize = 10);
        Task<Appointment> GetAppointmentByIdAsync(int id, int userId, string role);
        Task UpdateAppointmentAsync(int id, int userId, string role, AppointmentUpdateDto model);
        Task CancelAppointmentAsync(int id, int userId, string role);
        Task DeleteAppointmentAsync(int id, int userId, string role);
    }
}
