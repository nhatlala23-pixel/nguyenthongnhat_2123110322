using System;

namespace ConnectDB.DTOs
{
    public class AppointmentCreateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentTime { get; set; }
    }

    public class AppointmentUpdateDto
    {
        public int DoctorId { get; set; }
        public DateTime AppointmentTime { get; set; }
        public string? Status { get; set; }
    }
}
