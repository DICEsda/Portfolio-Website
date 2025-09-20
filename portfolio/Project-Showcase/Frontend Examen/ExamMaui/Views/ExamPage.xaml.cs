using FED___Exam.ViewModels;
using Microsoft.Maui.Devices;
using Microsoft.Maui.Controls;

namespace FED___Exam.Views;

public partial class ExamPage : ContentPage
{
    public ExamPage(ExamViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
    }

    private void OnToggleThemeClicked(object sender, EventArgs e)
    {
        App.Current.UserAppTheme = App.Current.UserAppTheme == AppTheme.Light
            ? AppTheme.Dark
            : AppTheme.Light;
    }

    private async void OnGoToExamPageClicked(object sender, EventArgs e)
        => await Shell.Current.GoToAsync("//exam");
    private async void OnGoToAddStudentPageClicked(object sender, EventArgs e)
        => await Shell.Current.GoToAsync("//addstudent");
    private async void OnGoToExamSessionPageClicked(object sender, EventArgs e)
        => await Shell.Current.GoToAsync("//session");
    private async void OnGoToHistoryPageClicked(object sender, EventArgs e)
        => await Shell.Current.GoToAsync("//history");
}
