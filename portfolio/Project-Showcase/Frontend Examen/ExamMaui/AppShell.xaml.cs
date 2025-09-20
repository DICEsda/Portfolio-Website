namespace FED___Exam
{
    public partial class AppShell : Shell
    {
        public AppShell()
        {
            InitializeComponent();

            Routing.RegisterRoute("exam", typeof(Views.ExamPage));
            Routing.RegisterRoute("addstudent", typeof(Views.AddStudentPage));
            Routing.RegisterRoute("session", typeof(Views.ExamSessionPage));
            Routing.RegisterRoute("history", typeof(Views.HistoryPage));
        }
    }
}
