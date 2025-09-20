using FED___Exam.Models;
using FED___Exam.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using System;
using System.Threading.Tasks;
using Microsoft.Maui.Controls;

namespace FED___Exam.ViewModels
{
    public partial class ExamViewModel : ObservableObject
    {
        private readonly IDataService _dataService;
        private Exam _lastSavedExam;

        public ExamViewModel()
        {
            _dataService = App.Current.Handler.MauiContext.Services.GetService(typeof(IDataService)) as IDataService;
            Date = DateTime.Today;
            StartTime = new TimeSpan(9, 0, 0);
            themeIcon = "\uf186"; // sun
        }

        [ObservableProperty]
        private string themeIcon = "\uf185";

        [ObservableProperty] private string termin;
        [ObservableProperty] private string courseName;
        [ObservableProperty] private DateTime date;
        [ObservableProperty] private string numberOfQuestions;
        [ObservableProperty] private string durationMinutes;
        [ObservableProperty] private TimeSpan startTime;

        private async Task SaveExamAsync()
        {
            if (string.IsNullOrWhiteSpace(Termin) || string.IsNullOrWhiteSpace(CourseName))
            {
                await Toast.Make("Udfyld både termin og kursusnavn").Show();
                return;
            }

            int.TryParse(NumberOfQuestions, out var questions);
            int.TryParse(DurationMinutes, out var minutes);

            var exam = new Exam
            {
                Termin = Termin,
                CourseName = CourseName,
                Date = Date,
                NumberOfQuestions = questions,
                DurationMinutes = minutes,
                StartTime = StartTime
            };

            await _dataService.AddExamAsync(exam);
            _lastSavedExam = exam;

            var snackbar = Snackbar.Make(
                "Eksamen gemt",
                async () =>
                {
                    await _dataService.DeleteExamAsync(_lastSavedExam);
                    await Toast.Make("Fortryd: Eksamen slettet").Show();
                },
                "Fortryd",
                TimeSpan.FromSeconds(5)
            );

            await snackbar.Show();

            // Nulstil felter
            Termin = string.Empty;
            CourseName = string.Empty;
            NumberOfQuestions = string.Empty;
            DurationMinutes = string.Empty;
            Date = DateTime.Today;
            StartTime = new TimeSpan(9, 0, 0);
        }

        private async Task ClearExamsAsync()
        {
            var exams = await _dataService.GetExamsAsync();
            foreach (var exam in exams)
            {
                // Delete all students for this exam
                var students = await _dataService.GetStudentsByExamIdAsync(exam.Id);
                foreach (var student in students)
                {
                    // Delete all results for this student
                    var results = await _dataService.GetResultsByExamIdAsync(exam.Id);
                    foreach (var result in results)
                    {
                        // Assuming you have a DeleteResultAsync method, otherwise skip
                        // await _dataService.DeleteResultAsync(result);
                    }
                    // Optionally, add a DeleteStudentAsync if you want to remove students
                    // await _dataService.DeleteStudentAsync(student);
                }
                await _dataService.DeleteExamAsync(exam);
            }
            await Toast.Make("Alle eksamener er slettet").Show();
        }
    }
}
