using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class MoodEntry
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [Range(1, 10)]
        public int MoodRating { get; set; } // 1-10 scale
        
        [MaxLength(100)]
        public string? MoodLabel { get; set; } // happy, sad, anxious, etc.
        
        [MaxLength(1000)]
        public string? Notes { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
}