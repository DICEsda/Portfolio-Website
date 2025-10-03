using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class FinancialEntry
    {
        public int Id { get; set; }
        
        [Required]
        public int UserId { get; set; }
        
        [Required]
        [MaxLength(50)]
        public string EntryType { get; set; } = string.Empty; // income, expense, asset, liability, net_worth
        
        [Required]
        [MaxLength(100)]
        public string Category { get; set; } = string.Empty; // salary, groceries, investment, etc.
        
        [Required]
        public decimal Amount { get; set; }
        
        [Required]
        [MaxLength(10)]
        public string Currency { get; set; } = "USD";
        
        [MaxLength(200)]
        public string? Description { get; set; }
        
        [MaxLength(100)]
        public string? AccountName { get; set; }
        
        [Required]
        public DateTime Date { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public User User { get; set; } = null!;
    }
}