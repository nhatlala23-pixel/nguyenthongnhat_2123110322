using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IDoctorService
    {
        Task<IEnumerable<Doctor>> GetAllDoctorsAsync();
        Task<Doctor?> GetDoctorByIdAsync(int id);
        Task<Doctor?> GetDoctorByUserIdAsync(int userId);
        Task<Doctor> AddDoctorAsync(DoctorCreateDto model);
        Task<bool> UpdateDoctorAsync(int id, DoctorUpdateDto model);
        Task<bool> DeleteDoctorAsync(int id);
    }
}
