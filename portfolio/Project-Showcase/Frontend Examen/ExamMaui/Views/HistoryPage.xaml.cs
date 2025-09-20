using FED___Exam.ViewModels;
using Microsoft.Maui.Controls;
namespace FED___Exam.Views;

public partial class HistoryPage : ContentPage
{
    public HistoryPage(HistoryViewModel viewModel)
    {
        InitializeComponent();
        BindingContext = viewModel;
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