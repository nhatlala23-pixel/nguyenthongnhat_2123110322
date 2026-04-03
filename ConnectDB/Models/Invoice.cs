using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ConnectDB.Models
{
    public class Invoice
    {
        [Key]
        public int Id { get; set; }

        public int AppointmentId { get; set; }
        [ForeignKey("AppointmentId")]
        public virtual Appointment? Appointment { get; set; }

        [Required]
        public decimal TotalAmount { get; set; }
        public bool IsPaid { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

