using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string TransactionId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string AccountId { get; set; } = string.Empty;
        
        public decimal Amount { get; set; }
        
        [MaxLength(10)]
        public string? Currency { get; set; }
        
        [MaxLength(500)]
        public string? Description { get; set; }
        
        [MaxLength(200)]
        public string? MerchantName { get; set; }
        
        [MaxLength(100)]
        public string? Category { get; set; }
        
        [MaxLength(50)]
        public string? Status { get; set; }
        
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation property
        public virtual Account Account { get; set; } = null!;
    }
} 