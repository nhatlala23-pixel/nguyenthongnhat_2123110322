using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models
{
    public class MedicalRecord
    {
        [Key]
        public int Id { get; set; }

        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public virtual Appointment? Appointment { get; set; }

        [Required]
        public string Symptoms { get; set; } = string.Empty;
        [Required]
        public string Diagnosis { get; set; } = string.Empty;

        public DateTime RecordDate { get; set; } = DateTime.Now;
    }
}

