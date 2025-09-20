using System.Collections.ObjectModel;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using CommunityToolkit.Maui.Alerts;
using FED___Exam.Models;
using System.Threading.Tasks;
using CommunityToolkit.Maui.Core;
using FED___Exam.Services;

namespace FED___Exam.ViewModels
{
    public partial class AddStudentViewModel : ObservableObject
    {
        private readonly IDataService _dataService;

        [ObservableProperty]
        private string name;

        [ObservableProperty]
        private string studentNo;

        [ObservableProperty]
        private string themeIcon = "\uf185";

        [ObservableProperty]
        private Exam selectedExam;

        public ObservableCollection<Exam> Exams { get; } = new();
        public ObservableCollection<Student> Students { get; } = new();
        public ICommand AddStudentCommand { get; }

        public AddStudentViewModel()
        {
            _dataService = App.Current.Handler.MauiContext.Services.GetService(typeof(IDataService)) as IDataService;
            AddStudentCommand = new AsyncRelayCommand(AddStudent);
            LoadExams().ConfigureAwait(false);
        }

        private async Task LoadExams()
        {
            var exams = await _dataService.GetExamsAsync();
            Exams.Clear();
            foreach (var exam in exams)
                Exams.Add(exam);
        }


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

        private async Task AddStudent()
        {
            if (SelectedExam == null)
            {
                await Snackbar.Make("Vælg en eksamen", null, "OK", TimeSpan.FromSeconds(3)).Show();
                return;
            }
            if (!string.IsNullOrWhiteSpace(Name) && !string.IsNullOrWhiteSpace(StudentNo))
            {
                var student = new Student
                {
                    Name = this.Name,
                    StudentNo = this.StudentNo,
                    ExamId = SelectedExam.Id
                };

                await _dataService.AddStudentAsync(student);
                Students.Add(student);

                // Clear fields
                Name = string.Empty;
                StudentNo = string.Empty;
                SelectedExam = null;

                await Snackbar.Make("Studerende tilføjet", null, "OK", TimeSpan.FromSeconds(3)).Show();
            }
            else
            {
                await Snackbar.Make("Udfyld både navn og studienummer", null, "OK", TimeSpan.FromSeconds(3)).Show();
            }
        }
    }
}
