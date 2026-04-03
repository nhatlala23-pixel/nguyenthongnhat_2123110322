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
    }

}

