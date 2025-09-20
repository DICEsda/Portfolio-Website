using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FED___Exam.Models;

namespace FED___Exam.Services
{
    public interface IDataService
    {
        Task InitAsync();
        Task<List<Exam>> GetExamsAsync();
        Task AddExamAsync(Exam exam);
        Task AddStudentAsync(Student student);
        Task<List<Student>> GetStudentsByExamIdAsync(int examId);
        Task SaveResultAsync(ExamResult result);
        Task<List<ExamResult>> GetResultsByExamIdAsync(int examId);
        Task DeleteExamAsync(Exam exam);
    }
}
