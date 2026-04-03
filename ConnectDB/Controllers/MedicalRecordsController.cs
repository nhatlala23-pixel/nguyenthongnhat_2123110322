using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using System.Security.Claims;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MedicalRecordsController(AppDbContext context)
        {
            _context = context;
        }

        // Bác sĩ khám bệnh + Kê đơn
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateMedicalRecord([FromBody] MedicalRecordCreateDto model)
        {
            var appointment = await _context.Appointments.FindAsync(model.AppointmentId);
            if (appointment == null || appointment.Status != "CheckedIn")
                return BadRequest("Invalid appointment or patient not checked in");

            var record = new MedicalRecord
            {
                AppointmentId = model.AppointmentId,
                Symptoms = model.Symptoms,
                Diagnosis = model.Diagnosis,
                RecordDate = DateTime.Now
            };

            _context.MedicalRecords.Add(record);
            await _context.SaveChangesAsync();

            // Nếu có kê đơn thuốc
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
                await _context.SaveChangesAsync();
            }

            // Tự động tạo hóa đơn (Giả định giá cố định 50$ + thuốc)
            var invoice = new Invoice
            {
                AppointmentId = model.AppointmentId,
                TotalAmount = 50 + (model.Prescriptions?.Count * 10 ?? 0),
                IsPaid = false
            };
            _context.Invoices.Add(invoice);

            appointment.Status = "Completed";
            await _context.SaveChangesAsync();

            return Ok(new { message = "Medical record and prescriptions created", invoiceId = invoice.Id });
        }
    }

    public class MedicalRecordCreateDto
    {
        public int AppointmentId { get; set; }
        public string Symptoms { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public List<PrescriptionDto>? Prescriptions { get; set; }
    }

    public class PrescriptionDto
    {
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }
}

