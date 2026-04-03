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

        // 2. Lấy danh sách hồ sơ (Staff thấy hết, Patient thấy của mình)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMedicalRecords()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole == "Admin" || userRole == "Doctor" || userRole == "Receptionist")
            {
                return Ok(await _context.MedicalRecords
                    .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Patient : null)
                    .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Doctor : null)
                    .ToListAsync());
            }

            var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
            if (patient == null) return NotFound("Patient profile not found");

            return Ok(await _context.MedicalRecords
                .Include(m => m.Appointment)
                .Where(m => m.Appointment!.PatientId == patient.Id)
                .ToListAsync());
        }

        // 3. Xem chi tiết
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMedicalRecord(int id)
        {
            var record = await _context.MedicalRecords
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Patient : null)
                .Include(m => m.Appointment).ThenInclude(a => a != null ? a.Doctor : null)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (record == null) return NotFound();

            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role);

            if (userRole != "Admin" && userRole != "Doctor" && record.Appointment?.Patient?.UserId != userId)
            {
                return Forbid();
            }

            // Lấy kèm đơn thuốc
            var prescriptions = await _context.Prescriptions.Where(p => p.MedicalRecordId == id).ToListAsync();

            return Ok(new { record, prescriptions });
        }

        // 4. Bác sĩ sửa chẩn đoán
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> PutMedicalRecord(int id, [FromBody] MedicalRecordUpdateDto model)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null) return NotFound();

            record.Symptoms = model.Symptoms;
            record.Diagnosis = model.Diagnosis;

            await _context.SaveChangesAsync();
            return Ok("Medical record updated");
        }

        // 5. Admin xóa hồ sơ
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var record = await _context.MedicalRecords.FindAsync(id);
            if (record == null) return NotFound();

            _context.MedicalRecords.Remove(record);
            await _context.SaveChangesAsync();
            return Ok("Medical record deleted");
        }
    }

    public class MedicalRecordCreateDto
    {
        public int AppointmentId { get; set; }
        public string Symptoms { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public List<PrescriptionDto>? Prescriptions { get; set; }
    }

    public class MedicalRecordUpdateDto
    {
        public string Symptoms { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
    }

    public class PrescriptionDto
    {
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }
}

