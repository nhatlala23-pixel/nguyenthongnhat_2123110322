using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using System.Security.Claims;

using ConnectDB.Services;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MedicalRecordsController : ControllerBase
    {
        private readonly IMedicalRecordService _medicalRecordService;

        public MedicalRecordsController(IMedicalRecordService medicalRecordService)
        {
            _medicalRecordService = medicalRecordService;
        }

        [HttpGet("patient/{patientId}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> GetPatientHistory(int patientId)
        {
            var history = await _medicalRecordService.GetPatientHistoryAsync(patientId);
            if (history == null) return NotFound();
            return Ok(history);
        }

        // Bác sĩ khám bệnh + Kê đơn
        [HttpPost]
        [Authorize(Roles = "Doctor")]
        public async Task<IActionResult> CreateMedicalRecord([FromBody] MedicalRecordCreateDto model)
        {
            var recordId = await _medicalRecordService.CreateMedicalRecordAsync(model);
            if (recordId == null)
                return BadRequest("Invalid appointment or patient not checked in");

            return Ok(new { message = "Medical record and prescriptions created", recordId = recordId });
        }

        // 2. Lấy danh sách hồ sơ (Staff thấy hết, Patient thấy của mình)
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetMedicalRecords()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var records = await _medicalRecordService.GetMedicalRecordsAsync(userId, userRole);
            return Ok(records);
        }

        // 3. Xem chi tiết
        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetMedicalRecord(int id)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var detail = await _medicalRecordService.GetMedicalRecordDetailAsync(id, userId, userRole);
            if (detail == null) return NotFound();

            return Ok(detail);
        }

        // 4. Bác sĩ sửa chẩn đoán
        [HttpPut("{id}")]
        [Authorize(Roles = "Doctor,Admin")]
        public async Task<IActionResult> PutMedicalRecord(int id, [FromBody] MedicalRecordUpdateDto model)
        {
            var success = await _medicalRecordService.UpdateMedicalRecordAsync(id, model);
            if (!success) return NotFound();

            return Ok("Medical record updated");
        }

        // 5. Admin xóa hồ sơ
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteMedicalRecord(int id)
        {
            var success = await _medicalRecordService.DeleteMedicalRecordAsync(id);
            if (!success) return NotFound();

            return Ok("Medical record deleted");
        }
    }


}

