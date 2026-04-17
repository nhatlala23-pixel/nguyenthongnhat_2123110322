using System;
using System.Collections.Generic;

namespace ConnectDB.DTOs
{
    public class ScheduleCreateDto
    {
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
        public List<string> TimeSlots { get; set; } = new List<string>();
    }

    public class ScheduleResponseDto
    {
        public int Id { get; set; }
        public int DoctorId { get; set; }
        public DateTime Date { get; set; }
        public string TimeSlot { get; set; } = string.Empty;
        public bool IsAvailable { get; set; }
    }
}
