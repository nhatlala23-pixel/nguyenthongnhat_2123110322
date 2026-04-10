using System.Collections.Generic;

namespace ConnectDB.DTOs
{
    public class MedicalRecordCreateDto
    {
        public int AppointmentId { get; set; }
        public string Symptoms { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
        public List<PrescriptionDto>? Prescriptions { get; set; }
    }

    public class MedicalRecordUpdateDto
    {
        public string Symptoms { get; set; } = string.Empty;
        public string Diagnosis { get; set; } = string.Empty;
    }

    public class PrescriptionDto
    {
        public string MedicationName { get; set; } = string.Empty;
        public string Dosage { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }
}
