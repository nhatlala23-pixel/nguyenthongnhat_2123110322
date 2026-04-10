using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IMedicalRecordService
    {
        Task<int?> CreateMedicalRecordAsync(MedicalRecordCreateDto model);
        Task<IEnumerable<MedicalRecord>> GetMedicalRecordsAsync(int userId, string role);
        Task<object?> GetMedicalRecordDetailAsync(int id, int userId, string role);
        Task<bool> UpdateMedicalRecordAsync(int id, MedicalRecordUpdateDto model);
        Task<bool> DeleteMedicalRecordAsync(int id);
    }
}
