using ConnectDB.DTOs;
using ConnectDB.Models;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace ConnectDB.Services
{
    public interface IUserService
    {
        Task<bool> RegisterAsync(UserRegisterDto model);
        Task<string?> LoginAsync(UserLoginDto model);
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User?> GetUserByIdAsync(int id);
        Task<bool> UpdateUserAsync(int id, UserUpdateDto model);
        Task<bool> DeleteUserAsync(int id);
    }
}
