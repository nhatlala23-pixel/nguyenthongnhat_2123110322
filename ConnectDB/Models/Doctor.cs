using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models
{
    public class Doctor
    {
        [Key]
        public int Id { get; set; }
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public virtual User? User { get; set;}

        [Required]
        public string FullName { get; set; } = string.Empty;
        [Required]
        public string Specialization { get; set; } = string.Empty;

        public string? ImageUrl { get; set; }

        public string? Position { get; set; } // e.g., PGS, TS, BS
        public string? Introduction { get; set; } // Short summary
        public string? Biography { get; set; } // Detailed history
        [Column(TypeName = "decimal(18, 2)")]
        public decimal? ConsultationPrice { get; set; }
        public string? ClinicAddress { get; set; }

        public int? DepartmentId { get; set; }
        [ForeignKey("DepartmentId")]
        public virtual Department? Department { get; set; }
    }

}

