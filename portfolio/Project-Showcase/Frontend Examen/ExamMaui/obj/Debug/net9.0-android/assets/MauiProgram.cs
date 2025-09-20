using FED___Exam.Services;
using FED___Exam.ViewModels;
using Microsoft.Extensions.Logging;
using CommunityToolkit.Maui;
namespace FED___Exam
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseMauiCommunityToolkit(options =>
                {
                    options.SetShouldEnableSnackbarOnWindows(true);

                })
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("fa-brands-400.ttf", "FontAwesomeBrands");
                    fonts.AddFont("fa-solid-900.ttf", "FontAwesomeSolid");
                });

#if DEBUG
            builder.Logging.AddDebug();
#endif

            // 👇 Registrer services og ViewModels her:
            builder.Services.AddSingleton<IDataService, DataService>();
            builder.Services.AddTransient<ExamSessionViewModel>();
            builder.Services.AddTransient<HistoryViewModel>();
            builder.Services.AddTransient<ExamViewModel>();
            builder.Services.AddTransient<AddStudentViewModel>();

            return builder.Build();
        }
    }
}
