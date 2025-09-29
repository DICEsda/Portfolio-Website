using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class User
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string GoogleId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(200)]
        public string Email { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string? Name { get; set; }
        
        [MaxLength(500)]
        public string? ProfilePictureUrl { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public ICollection<UserEntry> UserEntries { get; set; } = new List<UserEntry>();
        public ICollection<MoodEntry> MoodEntries { get; set; } = new List<MoodEntry>();
        public ICollection<JournalEntry> JournalEntries { get; set; } = new List<JournalEntry>();
        public ICollection<FinancialEntry> FinancialEntries { get; set; } = new List<FinancialEntry>();
        public ICollection<AIInsight> AIInsights { get; set; } = new List<AIInsight>();
    }
}