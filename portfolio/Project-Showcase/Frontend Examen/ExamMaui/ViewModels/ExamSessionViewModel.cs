using FED___Exam.Models;
using FED___Exam.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Timers;
using System.Threading.Tasks;

namespace FED___Exam.ViewModels
{
    public partial class ExamSessionViewModel : ObservableObject
    {
        private readonly IDataService _dataService;
        private System.Timers.Timer _timer;
        private int _remainingSeconds;
        private int _currentIndex = 0;
        private int _totalSeconds;

        public ExamSessionViewModel()
        {
            _dataService = App.Current.Handler.MauiContext.Services.GetService(typeof(IDataService)) as IDataService;
            Exams = new ObservableCollection<Exam>();
            Students = new ObservableCollection<Student>();
            Grades = new ObservableCollection<string> { "00", "02", "4", "7", "10", "12" };
            LoadExamsAsync().ConfigureAwait(false);
        }

        public ObservableCollection<Exam> Exams { get; }
        public ObservableCollection<Student> Students { get; }
        public ObservableCollection<string> Grades { get; }

        [ObservableProperty] private Exam selectedExam;
        [ObservableProperty] private Student currentStudent;
        [ObservableProperty] private string questionNo;
        [ObservableProperty] private string notes;
        [ObservableProperty] private string selectedGrade;
        [ObservableProperty] private string remainingTime;
        [ObservableProperty] private int remainingSeconds;
        [ObservableProperty] private int totalSeconds;

        private async Task LoadExamsAsync()
        {
            await _dataService.InitAsync();
            var exams = await _dataService.GetExamsAsync();
            Exams.Clear();
            foreach (var exam in exams)
                Exams.Add(exam);
        }

        partial void OnSelectedExamChanged(Exam value)
        {
            LoadStudentsAsync().ConfigureAwait(false);
        }

        private async Task LoadStudentsAsync()
        {
            Students.Clear();
            var list = await _dataService.GetStudentsByExamIdAsync(SelectedExam.Id);
            foreach (var student in list)
                Students.Add(student);

            _currentIndex = 0;
            CurrentStudent = Students.ElementAtOrDefault(_currentIndex);
        }

        private void DrawQuestion()
        {
            if (SelectedExam != null)
            {
                var rand = new Random();
                QuestionNo = rand.Next(1, SelectedExam.NumberOfQuestions + 1).ToString();
            }
        }

        private void StartExam()
        {
            if (SelectedExam == null) return;
            TotalSeconds = SelectedExam.DurationMinutes * 60;
            RemainingSeconds = TotalSeconds;
            UpdateRemainingTime();

            _timer = new System.Timers.Timer(1000);
            _timer.Elapsed += (s, e) =>
            {
                if (RemainingSeconds > 0)
                {
                    RemainingSeconds--;
                    UpdateRemainingTime();
                }
                if (RemainingSeconds <= 0)
                {
                    _timer.Stop();
                }
            };
            _timer.Start();
        }

        [ObservableProperty]
        private string themeIcon = "\uf185";

        private void ToggleTheme()
        {
            if (App.Current.UserAppTheme == AppTheme.Light)
            {
                App.Current.UserAppTheme = AppTheme.Dark;
                ThemeIcon = "\uf186"; // moon
            }
            else
            {
                App.Current.UserAppTheme = AppTheme.Light;
                ThemeIcon = "\uf185"; // sun
            }
        }

        private void UpdateRemainingTime()
        {
            RemainingTime = TimeSpan.FromSeconds(RemainingSeconds).ToString(@"mm\:ss");
        }

        private void EndExam()
        {
            _timer?.Stop();
        }

        private async Task SaveResultAndNextAsync()
        {
            if (CurrentStudent == null || SelectedExam == null || string.IsNullOrWhiteSpace(SelectedGrade))
            {
                await Snackbar.Make("Udfyld karakter og vælg eksamen og studerende", null, "OK", TimeSpan.FromSeconds(3)).Show();
                return;
            }

            var result = new ExamResult
            {
                StudentId = CurrentStudent.Id,
                QuestionNo = int.TryParse(QuestionNo, out var qNo) ? qNo : 0,
                ActualDuration = TimeSpan.FromSeconds(SelectedExam.DurationMinutes * 60 - _remainingSeconds),
                Notes = Notes,
                Grade = SelectedGrade
            };

            await _dataService.SaveResultAsync(result);
            await Snackbar.Make("Resultat gemt", null, "OK", TimeSpan.FromSeconds(3)).Show();

            _currentIndex++;
            if (_currentIndex < Students.Count)
            {
                CurrentStudent = Students[_currentIndex];
                QuestionNo = string.Empty;
                Notes = string.Empty;
                SelectedGrade = null;
                RemainingTime = string.Empty;
            }
            else
            {
                CurrentStudent = null;
                await Snackbar.Make("Alle studerende færdige", null, "OK", TimeSpan.FromSeconds(3)).Show();
                await Shell.Current.DisplayAlert("Færdig", "Eksamen er afsluttet", "OK");
            }
        }
    }
}
