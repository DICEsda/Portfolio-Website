using System.ComponentModel.DataAnnotations;

namespace PersonalTrackerBackend.Data.Models
{
    public class RequestLog
    {
        public int Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string AccountId { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(100)]
        public string Endpoint { get; set; } = string.Empty;
        
        [MaxLength(50)]
        public string? Status { get; set; }
        
        public int? StatusCode { get; set; }
        
        [MaxLength(1000)]
        public string? ErrorMessage { get; set; }
        
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
} 