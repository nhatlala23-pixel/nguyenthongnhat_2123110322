using ConnectDB.Data;
using ConnectDB.DTOs;
using ConnectDB.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ConnectDB.Services
{
    public class DoctorService : IDoctorService
    {
        private readonly AppDbContext _context;

        public DoctorService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Doctor>> GetAllDoctorsAsync()
        {
            return await _context.Doctors.Include(d => d.Department).ToListAsync();
        }

        public async Task<Doctor?> GetDoctorByIdAsync(int id)
        {
            return await _context.Doctors.Include(d => d.Department).FirstOrDefaultAsync(d => d.Id == id);
        }

        public async Task<Doctor?> GetDoctorByUserIdAsync(int userId)
        {
            return await _context.Doctors.Include(d => d.Department).FirstOrDefaultAsync(d => d.UserId == userId);
        }

        public async Task<Doctor> AddDoctorAsync(DoctorCreateDto model)
        {
            // 0. Kiểm tra Username đã tồn tại chưa
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                throw new System.Exception("Tên đăng nhập đã tồn tại trong hệ thống.");
            }

            // 1. Tạo User trước
            var user = new User
            {
                Username = model.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(model.Password),
                Role = "Doctor"
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // 2. Tạo Doctor liên kết với User
            var doctor = new Doctor
            {
                UserId = user.Id,
                FullName = model.FullName,
                Specialization = model.Specialization,
                ImageUrl = model.ImageUrl,
                DepartmentId = model.DepartmentId,
                Position = model.Position,
                Introduction = model.Introduction,
                Biography = model.Biography,
                ConsultationPrice = model.ConsultationPrice,
                ClinicAddress = model.ClinicAddress
            };
            _context.Doctors.Add(doctor);
            await _context.SaveChangesAsync();

            return doctor;
        }

        public async Task<bool> UpdateDoctorAsync(int id, DoctorUpdateDto model)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return false;

            doctor.FullName = model.FullName;
            doctor.Specialization = model.Specialization;
            doctor.ImageUrl = model.ImageUrl;
            doctor.DepartmentId = model.DepartmentId;
            doctor.Position = model.Position;
            doctor.Introduction = model.Introduction;
            doctor.Biography = model.Biography;
            doctor.ConsultationPrice = model.ConsultationPrice;
            doctor.ClinicAddress = model.ClinicAddress;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteDoctorAsync(int id)
        {
            var doctor = await _context.Doctors.FindAsync(id);
            if (doctor == null) return false;

            _context.Doctors.Remove(doctor);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
