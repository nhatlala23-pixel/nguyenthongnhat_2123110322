using System;
using System.Collections.Generic;

namespace ConnectDB.DTOs
{
    public class DoctorDashboardStatsDto
    {
        public int TotalPatients { get; set; }
        public int AppointmentsToday { get; set; }
        public int PriorityCases { get; set; }
        public double PatientGrowth { get; set; } // % tăng trưởng
        public int CompletedToday { get; set; }
    }
}
