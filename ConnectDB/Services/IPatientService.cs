using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IPatientService
    {
        Task<IEnumerable<Patient>> GetAllPatientsAsync();
        Task<Patient?> GetPatientByIdAsync(int id, int userId, string role);
        Task<IEnumerable<Patient>> GetPatientsByDoctorAsync(int doctorUserId);
        Task<Patient> AddPatientAsync(PatientCreateDto model);
        Task<bool> UpdatePatientAsync(int id, int userId, string role, PatientUpdateDto model);
        Task<bool> DeletePatientAsync(int id);
    }
}
