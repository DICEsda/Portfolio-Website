using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using FED___Exam.Models;
using SQLite;

namespace FED___Exam.Services
{
    public class DataService : IDataService
    {
        private SQLiteAsyncConnection _database;

        public async Task InitAsync()
        {
            if (_database != null)
                return;

            var dbPath = Path.Combine(FileSystem.AppDataDirectory, "exams.db3");
            _database = new SQLiteAsyncConnection(dbPath);
            await _database.CreateTableAsync<Exam>();
            await _database.CreateTableAsync<Student>();
            await _database.CreateTableAsync<ExamResult>();
        }

        public async Task<List<Exam>> GetExamsAsync()
        {
            await InitAsync();
            try
            {
                return await _database.Table<Exam>().ToListAsync();
            }
            catch (Exception ex)
            {
                // Log or handle the exception as needed
                Console.WriteLine($"Error in GetExamsAsync: {ex.Message}");
                return new List<Exam>();
            }
        }

        public async Task AddExamAsync(Exam exam)
        {
            await InitAsync();
            try
            {
                await _database.InsertAsync(exam);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddExamAsync: {ex.Message}");
            }
        }

        public async Task AddStudentAsync(Student student)
        {
            await InitAsync();
            try
            {
                await _database.InsertAsync(student);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in AddStudentAsync: {ex.Message}");
            }
        }

        public async Task<List<Student>> GetStudentsByExamIdAsync(int examId)
        {
            await InitAsync();
            try
            {
                return await _database.Table<Student>()
                                      .Where(s => s.ExamId == examId)
                                      .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetStudentsByExamIdAsync: {ex.Message}");
                return new List<Student>();
            }
        }

        public async Task SaveResultAsync(ExamResult result)
        {
            await InitAsync();
            try
            {
                await _database.InsertAsync(result);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in SaveResultAsync: {ex.Message}");
            }
        }
        public async Task DeleteExamAsync(Exam exam)
        {
            await InitAsync(); // ensures _database is initialized
            try
            {
                await _database.DeleteAsync(exam);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in DeleteExamAsync: {ex.Message}");
            }
        }


        public async Task<List<ExamResult>> GetResultsByExamIdAsync(int examId)
        {
            await InitAsync();
            try
            {
                return await _database.Table<ExamResult>()
                                      .Where(r => r.StudentId != 0) // evt. filtrér med Join hvis nødvendigt
                                      .ToListAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error in GetResultsByExamIdAsync: {ex.Message}");
                return new List<ExamResult>();
            }
        }
    }
}
