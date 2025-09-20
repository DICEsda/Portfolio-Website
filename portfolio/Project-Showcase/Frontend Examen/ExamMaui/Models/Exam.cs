using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace FED___Exam.Models
{
    public class Exam
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public string Termin { get; set; }
        public string CourseName { get; set; }
        public DateTime Date { get; set; }
        public int NumberOfQuestions { get; set; }
        public int DurationMinutes { get; set; }
        public TimeSpan StartTime { get; set; }
    }
}
