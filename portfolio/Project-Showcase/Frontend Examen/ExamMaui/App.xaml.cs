namespace FED___Exam
{
    public partial class App : Application
    {
        public App()
        {
            InitializeComponent();

            // Sæt lys tema som default
            UserAppTheme = AppTheme.Light;

            // Du behøver ikke sætte MainPage her, hvis du bruger CreateWindow
        }

        protected override Window CreateWindow(IActivationState? activationState)
        {
            var window = new Window(new AppShell());
#if WINDOWS
            window.Width = 800;
            window.Height = 750;
#endif
            return window;
        }
    }
}
