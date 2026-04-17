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
    public class PatientsController : ControllerBase
    {
        private readonly IPatientService _patientService;

        public PatientsController(IPatientService patientService)
        {
            _patientService = patientService;
        }

        // GET: api/Patients
        [HttpGet]
        [Authorize(Roles = "Admin,Doctor,Receptionist")]
        public async Task<ActionResult<IEnumerable<Patient>>> GetPatients()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var role = User.FindFirstValue(ClaimTypes.Role)!;

            if (role == "Doctor")
            {
                return Ok(await _patientService.GetPatientsByDoctorAsync(userId));
            }

            return Ok(await _patientService.GetAllPatientsAsync());
        }

        // GET: api/Patients/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetPatient(int id)
        {
            var userId = int.Parse(User.FindFirst("id")?.Value ?? "0");
            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value ?? "";
            
            var patient = await _patientService.GetPatientByIdAsync(id, userId, role);
            if (patient == null) return NotFound();
            return Ok(patient);
        }

        [HttpPost]
        public async Task<IActionResult> CreatePatient(PatientCreateDto model)
        {
            try
            {
                var patient = await _patientService.AddPatientAsync(model);
                return CreatedAtAction(nameof(GetPatient), new { id = patient.Id }, patient);
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // PUT: api/Patients/5
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutPatient(int id, PatientUpdateDto model)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            var userRole = User.FindFirstValue(ClaimTypes.Role)!;

            var success = await _patientService.UpdatePatientAsync(id, userId, userRole, model);
            if (!success) return Forbid();

            return NoContent();
        }

        // DELETE: api/Patients/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeletePatient(int id)
        {
            var success = await _patientService.DeletePatientAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }


}
