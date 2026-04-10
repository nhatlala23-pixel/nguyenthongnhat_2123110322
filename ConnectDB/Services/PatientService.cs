using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public class PatientService : IPatientService
    {
        private readonly AppDbContext _context;

        public PatientService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Patient>> GetAllPatientsAsync()
        {
            return await _context.Patients.Include(p => p.User).ToListAsync();
        }

        public async Task<Patient?> GetPatientByIdAsync(int id, int userId, string role)
        {
            var patient = await _context.Patients.Include(p => p.User).FirstOrDefaultAsync(p => p.Id == id);
            if (patient == null) return null;

            if (role != "Admin" && role != "Doctor" && role != "Receptionist" && patient.UserId != userId)
            {
                return null;
            }

            return patient;
        }

        public async Task<bool> UpdatePatientAsync(int id, int userId, string role, PatientUpdateDto model)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return false;

            if (role != "Admin" && patient.UserId != userId)
            {
                return false;
            }

            patient.FullName = model.FullName;
            patient.DateOfBirth = model.DateOfBirth;
            patient.Gender = model.Gender;
            patient.PhoneNumber = model.PhoneNumber;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeletePatientAsync(int id)
        {
            var patient = await _context.Patients.FindAsync(id);
            if (patient == null) return false;

            _context.Patients.Remove(patient);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
