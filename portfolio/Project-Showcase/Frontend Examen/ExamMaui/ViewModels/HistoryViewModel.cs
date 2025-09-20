using FED___Exam.Models;
using FED___Exam.Services;
using CommunityToolkit.Mvvm.ComponentModel;
using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using CommunityToolkit.Maui.Alerts;
using CommunityToolkit.Maui.Core;
using CommunityToolkit.Mvvm.Input;

namespace FED___Exam.ViewModels
{
    public partial class HistoryViewModel : ObservableObject
    {
        private readonly IDataService _dataService;


        public HistoryViewModel(IDataService dataService)
        {
            _dataService = dataService;

            Exams = new ObservableCollection<Exam>();
            Results = new ObservableCollection<ResultDisplayModel>();

            LoadExamsAsync().ConfigureAwait(false);
        }

        [ObservableProperty]
        private string themeIcon = "\uf185";

        [RelayCommand]
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

        public ObservableCollection<Exam> Exams { get; }
        public ObservableCollection<ResultDisplayModel> Results { get; }

        [ObservableProperty] private Exam selectedExam;
        [ObservableProperty] private string averageGrade;

        [RelayCommand]
        private async Task LoadExamsAsync()
        {
            try
            {
                await _dataService.InitAsync();
                var exams = await _dataService.GetExamsAsync();
                Exams.Clear();
                foreach (var exam in exams)
                    Exams.Add(exam);
                await Snackbar.Make($"{exams.Count} eksamener hentet", null, "OK", TimeSpan.FromSeconds(2)).Show();
            }
            catch (Exception ex)
            {
                await Snackbar.Make($"Fejl ved hentning af eksamener: {ex.Message}", null, "OK", TimeSpan.FromSeconds(3)).Show();
            }
        }

        partial void OnSelectedExamChanged(Exam value)
        {
            LoadResultsAsync().ConfigureAwait(false);
        }

        private async Task LoadResultsAsync()
        {
            try
            {
                Results.Clear();
                var resultList = await _dataService.GetResultsByExamIdAsync(SelectedExam.Id);
                var students = await _dataService.GetStudentsByExamIdAsync(SelectedExam.Id);

                foreach (var res in resultList)
                {
                    var student = students.FirstOrDefault(s => s.Id == res.StudentId);
                    Results.Add(new ResultDisplayModel
                    {
                        Name = student?.Name,
                        QuestionNo = res.QuestionNo,
                        ActualDuration = res.ActualDuration,
                        Grade = res.Grade,
                        Notes = res.Notes
                    });
                }

                if (Results.Count > 0)
                {
                    var avg = Results.Select(r => TryParseGrade(r.Grade)).Where(n => n >= 0).DefaultIfEmpty().Average();
                    AverageGrade = avg.ToString("0.00");
                    await Snackbar.Make($"{Results.Count} resultater hentet", null, "OK", TimeSpan.FromSeconds(2)).Show();
                }
                else
                {
                    AverageGrade = "-";
                    await Snackbar.Make("Ingen resultater fundet", null, "OK", TimeSpan.FromSeconds(2)).Show();
                }
            }
            catch (Exception ex)
            {
                await Snackbar.Make($"Fejl ved hentning af resultater: {ex.Message}", null, "OK", TimeSpan.FromSeconds(3)).Show();
            }
        }

        private int TryParseGrade(string grade)
        {
            return int.TryParse(grade, out var result) ? result : -1;
        }
    }

    public class ResultDisplayModel
    {
        public string Name { get; set; }
        public int QuestionNo { get; set; }
        public TimeSpan ActualDuration { get; set; }
        public string Grade { get; set; }
        public string Notes { get; set; }
    }
}
