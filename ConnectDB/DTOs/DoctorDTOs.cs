namespace ConnectDB.DTOs
{
    public class DoctorCreateDto
    {
        public string Username { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile? Image { get; set; }
        public int? DepartmentId { get; set; }
        
        public string? Position { get; set; }
        public string? Introduction { get; set; }
        public string? Biography { get; set; }
        public decimal? ConsultationPrice { get; set; }
        public string? ClinicAddress { get; set; }
    }

    public class DoctorUpdateDto
    {
        public string FullName { get; set; } = string.Empty;
        public string Specialization { get; set; } = string.Empty;
        public string? ImageUrl { get; set; }
        public Microsoft.AspNetCore.Http.IFormFile? Image { get; set; }
        public int? DepartmentId { get; set; }

        public string? Position { get; set; }
        public string? Introduction { get; set; }
        public string? Biography { get; set; }
        public decimal? ConsultationPrice { get; set; }
        public string? ClinicAddress { get; set; }
    }
}
