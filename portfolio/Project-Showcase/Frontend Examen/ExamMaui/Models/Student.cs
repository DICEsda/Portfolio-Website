using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using SQLite;

namespace FED___Exam.Models
{
    public class Student
    {
        [PrimaryKey, AutoIncrement]
        public int Id { get; set; }
        public int ExamId { get; set; }
        public string StudentNo { get; set; }
        public string Name { get; set; }

        public string Email { get; set; }  // NY
        public int Age { get; set; }       // NY
    }

}
