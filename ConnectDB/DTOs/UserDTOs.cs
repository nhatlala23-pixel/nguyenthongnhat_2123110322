namespace ConnectDB.DTOs
{
    public class UserUpdateDto
    {
        public string Role { get; set; } = "Patient";
        public string? Password { get; set; }
    }
}
