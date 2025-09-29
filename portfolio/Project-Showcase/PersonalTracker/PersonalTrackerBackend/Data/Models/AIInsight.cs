using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class AIInsight
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string InsightType { get; set; } = string.Empty; // weekly_summary, mood_pattern, fitness_trend, etc.
        
        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;
        
        [Required]
        public string Content { get; set; } = string.Empty;
        
        [MaxLength(1000)]
        public string? DataSummary { get; set; } // JSON summary of analyzed data
        
        [Required]
        public DateTime GeneratedAt { get; set; } = DateTime.UtcNow;
        
        public DateTime? ExpiresAt { get; set; } // For time-sensitive insights
        
        public bool IsRead { get; set; } = false;
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
}