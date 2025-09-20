using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace FED___Exam.Models
{
    public class ExamResult
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int StudentId { get; set; }
        public int QuestionNo { get; set; }
        public TimeSpan ActualDuration { get; set; }
        public string Notes { get; set; }
        public string Grade { get; set; }
    }

}
