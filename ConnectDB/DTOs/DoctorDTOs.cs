namespace ConnectDB.DTOs
{
    public class DoctorCreateDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
    }

    public class DoctorUpdateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public int? DepartmentId { get; set; }
    }
}
