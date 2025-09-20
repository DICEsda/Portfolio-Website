using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class Account
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string AccountId { get; set; } = string.Empty;
        
        [MaxLength(200)]
        public string? Name { get; set; }
        
        [MaxLength(200)]
        public string? OwnerName { get; set; }
        
        [MaxLength(10)]
        public string? Currency { get; set; }
        
        [MaxLength(50)]
        public string? Type { get; set; }
        
        [MaxLength(50)]
        public string? Status { get; set; }
        
        [MaxLength(100)]
        public string? BankId { get; set; }
        
        [MaxLength(100)]
        public string? RequisitionId { get; set; }
        
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        
        // Navigation properties
        public virtual ICollection<AccountBalance> Balances { get; set; } = new List<AccountBalance>();
        public virtual ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
} 