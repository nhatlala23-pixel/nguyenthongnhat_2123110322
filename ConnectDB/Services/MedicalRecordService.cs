using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public class MedicalRecordService : IMedicalRecordService
    {
        private readonly AppDbContext _context;

        public MedicalRecordService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<int?> CreateMedicalRecordAsync(MedicalRecordCreateDto model)
        {
            var appointment = await _context.Appointments.FindAsync(model.AppointmentId);
            if (appointment == null || appointment.Status != "CheckedIn")
                return null;

            var record = new MedicalRecord
            {
                AppointmentId = model.AppointmentId,
                Symptoms = model.Symptoms,
                Diagnosis = model.Diagnosis,
                RecordDate = DateTime.Now
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            // Handle prescriptions
            if (model.Prescriptions != null && model.Prescriptions.Any())
            {
                foreach (var p in model.Prescriptions)
                {
                    _context.Prescriptions.Add(new Prescription
                    {
                        MedicalRecordId = record.Id,
                        MedicationName = p.MedicationName,
                        Dosage = p.Dosage,
                        Duration = p.Duration
                    });
                }
            }

            // Automated invoice creation
            var invoice = new Invoice
            {
                AppointmentId = model.AppointmentId,
                TotalAmount = 50 + (model.Prescriptions?.Count * 10 ?? 0),
                IsPaid = false,
                CreatedDate = DateTime.Now
            };
            _context.Invoices.Add(invoice);

            // Update appointment status
            appointment.Status = "Completed";

            await _context.SaveChangesAsync();
            return record.Id;
        }

        public async Task<IEnumerable<MedicalRecord>> GetMedicalRecordsAsync(int userId, string role)
        {
            var query = _context.MedicalRecords
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Patient : null)
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Doctor : null)
                .AsQueryable();

            if (role == "Admin" || role == "Doctor" || role == "Receptionist")
            {
                return await query.ToListAsync();
            }

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return Enumerable.Empty<MedicalRecord>();

            return await query.Where(m => m.Appointment!.PatientId == patient.Id).ToListAsync();
        }

        public async Task<object?> GetMedicalRecordDetailAsync(int id, int userId, string role)
        {
            var record = await _context.MedicalRecords
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Patient : null)
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Doctor : null)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (record == null) return null;

            if (role != "Admin" && role != "Doctor" && record.Appointment?.Patient?.UserId != userId)
            {
                return null;
            }

            var prescriptions = await _context.Prescriptions.Where(p => p.MedicalRecordId == id).ToListAsync();

            return new { record, prescriptions };
        }

        public async Task<bool> UpdateMedicalRecordAsync(int id, MedicalRecordUpdateDto model)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null) return false;

            record.Symptoms = model.Symptoms;
            record.Diagnosis = model.Diagnosis;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteMedicalRecordAsync(int id)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null) return false;

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
