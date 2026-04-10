using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IAppointmentService
    {
        Task<int?> BookAppointmentAsync(int userId, AppointmentCreateDto model);
        Task<bool> ConfirmAppointmentAsync(int id);
        Task<bool> CheckInAsync(int id);
        Task<IEnumerable<Appointment>> GetAppointmentsAsync(int userId, string role);
        Task<Appointment?> GetAppointmentByIdAsync(int id, int userId, string role);
        Task<bool> UpdateAppointmentAsync(int id, int userId, string role, AppointmentUpdateDto model);
        Task<bool> CancelAppointmentAsync(int id, int userId, string role);
        Task<bool> DeleteAppointmentAsync(int id, int userId, string role);
    }
}
