using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;

namespace FinanceTracker.Models;

[PrimaryKey(nameof(CompanyName), nameof(UserId))]
public class Job
{
    public string? Title { get; set; }
    public string? TaxCard { get; set; }
    public string? EmploymentType { get; set; }
    public string CompanyName { get; set; }
    public decimal HourlyRate { get; set; }

    
    public string UserId { get; set; }
    [JsonIgnore]
    public FinanceUser User { get; set; }


}