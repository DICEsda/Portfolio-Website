namespace FinanceTracker.DTO
{
    public class PayCheckDTO
    {
        public decimal Tax { get; set; }
        public decimal SalaryBeforeTax { get; set; }
        public decimal AMContribution { get; set; }
        public decimal SalaryAfterTax { get; set; }
        public double WorkedHours { get; set; }

    }
}
