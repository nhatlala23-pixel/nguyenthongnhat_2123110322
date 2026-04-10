using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConnectDB.Data;
using ConnectDB.Models;
using ConnectDB.DTOs;
using Microsoft.EntityFrameworkCore;

using ConnectDB.Services;

namespace ConnectDB.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUserService _userService;

        public AuthController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto model)
        {
            var success = await _userService.RegisterAsync(model);
            if (!success)
                return BadRequest("Username already exists");

            return Ok("User registered successfully");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto model)
        {
            var token = await _userService.LoginAsync(model);

            if (token == null)
                return Unauthorized("Invalid username or password");

            return Ok(new { token });
        }
    }
}
