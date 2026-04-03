using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models
{
    public class Prescription
    {
        [Key]
        public int Id { get; set; }

        public int MedicalRecordId { get; set; }
        [ForeignKey("MedicalRecordId")]
        public virtual MedicalRecord? MedicalRecord { get; set; }

        [Required]
        public string MedicationName { get; set; } = string.Empty;
        [Required]
        public string Dosage { get; set; } = string.Empty;
        public string Duration { get; set; } = string.Empty;
    }
}

