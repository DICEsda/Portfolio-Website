namespace FinanceTracker.DTO
{
    public class SupplementDetailsDTO
    {

        public DayOfWeek Weekday { get; set; }
        public decimal Amount { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
    }
}
