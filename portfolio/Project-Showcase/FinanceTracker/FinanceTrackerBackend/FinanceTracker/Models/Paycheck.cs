using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FinanceTracker.Models
{
    public class Paycheck
    {
        public int PaycheckId { get; set; } // Dynamic
        public decimal Tax { get; set; }
        public decimal SalaryBeforeTax { get; set; } // Dynamic
        public decimal HolidaySupplement { get; set; }
        public decimal Pension { get; set; }
        public decimal VacationPay { get; set; }
        public decimal SalaryAfterTax { get; set; }
        public decimal TaxDeduction { get; set; } // Dynamic
        public decimal AMContribution { get; set; }
        public double WorkedHours { get; set; } // Dynamic


    }
}
