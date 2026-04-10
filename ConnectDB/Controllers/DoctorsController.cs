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
    public class DoctorsController : ControllerBase
    {
        private readonly IDoctorService _doctorService;
        private readonly IUserService _userService; // Need this for PostDoctor

        public DoctorsController(IDoctorService doctorService, IUserService userService)
        {
            _doctorService = doctorService;
            _userService = userService;
        }

        // POST: api/Doctors
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Doctor>> PostDoctor(DoctorCreateDto model)
        {
            // Tạm thời giữ logic đăng ký User ở đây hoặc ủy quyền cho UserService
            var success = await _userService.RegisterAsync(new UserRegisterDto 
            { 
                Username = model.Username, 
                Password = model.Password, 
                Role = "Doctor", 
                FullName = model.FullName, 
                Specialization = model.Specialization 
            });

            if (!success) return BadRequest("Username already exists");

            // Lấy lại bác sĩ vừa tạo (vì logic tạo profile đã nằm trong RegisterAsync của UserService)
            // Đây là một ví dụ về việc logic RegisterAsync đang gánh quá nhiều. 
            // Nhưng để cho đồng bộ, ta cứ lấy danh sách.
            return Ok("Doctor created successfully via registration");
        }

        // GET: api/Doctors
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
        {
            return Ok(await _doctorService.GetAllDoctorsAsync());
        }

        // GET: api/Doctors/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Doctor>> GetDoctor(int id)
        {
            var doctor = await _doctorService.GetDoctorByIdAsync(id);
            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        // PUT: api/Doctors/5
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> PutDoctor(int id, DoctorUpdateDto model)
        {
            var success = await _doctorService.UpdateDoctorAsync(id, model);
            if (!success) return NotFound();

            return NoContent();
        }

        // DELETE: api/Doctors/5
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteDoctor(int id)
        {
            var success = await _doctorService.DeleteDoctorAsync(id);
            if (!success) return NotFound();

            return NoContent();
        }
    }


}
