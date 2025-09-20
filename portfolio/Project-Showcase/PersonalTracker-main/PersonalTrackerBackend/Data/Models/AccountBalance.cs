using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class AccountBalance
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string AccountId { get; set; } = string.Empty;
        
        public decimal Balance { get; set; }
        
        [MaxLength(10)]
        public string? Currency { get; set; }
        
        [MaxLength(50)]
        public string? Type { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Account Account { get; set; } = null!;
    }
} 