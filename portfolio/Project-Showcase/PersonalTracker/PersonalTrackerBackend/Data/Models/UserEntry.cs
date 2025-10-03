using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class UserEntry
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string MetricType { get; set; } = string.Empty; // steps, calories, weight, etc.
        
        [Required]
        public decimal Value { get; set; }
        
        [MaxLength(20)]
        public string? Unit { get; set; } // kg, lbs, calories, steps, etc.
        
        [Required]
        public DateTime Date { get; set; }
        
        [MaxLength(500)]
        public string? Notes { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
}