using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Text;
using System.Text.Json;

namespace PersonalTrackerBackend.Services
{
    public interface IAIService
    {
        Task<AIInsight> GenerateWeeklySummaryAsync(int userId);
        Task<AIInsight> GenerateMoodPatternAnalysisAsync(int userId, DateTime fromDate, DateTime toDate);
        Task<AIInsight> GenerateFitnessTrendAnalysisAsync(int userId, DateTime fromDate, DateTime toDate);
        Task<AIInsight> GenerateFinancialInsightAsync(int userId, DateTime fromDate, DateTime toDate);
    }

    public class AIService : IAIService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;

        public AIService(AppDbContext context, IConfiguration configuration, HttpClient httpClient)
        {
            _context = context;
            _configuration = configuration;
            _httpClient = httpClient;
        }

        public async Task<AIInsight> GenerateWeeklySummaryAsync(int userId)
        {
            var endDate = DateTime.UtcNow.Date;
            var startDate = endDate.AddDays(-7);

            // Gather data for the week
            var userEntries = await _context.UserEntries
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();

            var moodEntries = await _context.MoodEntries
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();

            var journalEntries = await _context.JournalEntries
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();

            var financialEntries = await _context.FinancialEntries
                .Where(e => e.UserId == userId && e.Date >= startDate && e.Date <= endDate)
                .ToListAsync();

            // Create data summary
            var dataSummary = new
            {
                period = $"{startDate:yyyy-MM-dd} to {endDate:yyyy-MM-dd}",
                userEntries = userEntries.GroupBy(e => e.MetricType).ToDictionary(g => g.Key, g => new
                {
                    count = g.Count(),
                    average = g.Average(e => (double)e.Value),
                    total = g.Sum(e => (double)e.Value)
                }),
                mood = new
                {
                    entriesCount = moodEntries.Count,
                    averageRating = moodEntries.Any() ? moodEntries.Average(e => e.MoodRating) : 0,
                    ratings = moodEntries.Select(e => e.MoodRating).ToList()
                },
                journalEntriesCount = journalEntries.Count,
                financial = new
                {
                    income = financialEntries.Where(e => e.EntryType == "income").Sum(e => (double)e.Amount),
                    expenses = financialEntries.Where(e => e.EntryType == "expense").Sum(e => (double)e.Amount),
                    transactionCount = financialEntries.Count
                }
            };

            // Generate AI insights using OpenAI or fallback to rule-based
            var content = await GenerateInsightContentAsync("weekly_summary", JsonSerializer.Serialize(dataSummary));

            var insight = new AIInsight
            {
                UserId = userId,
                InsightType = "weekly_summary",
                Title = "Weekly Summary",
                Content = content,
                DataSummary = JsonSerializer.Serialize(dataSummary),
                GeneratedAt = DateTime.UtcNow,
                ExpiresAt = DateTime.UtcNow.AddDays(7)
            };

            return insight;
        }

        public async Task<AIInsight> GenerateMoodPatternAnalysisAsync(int userId, DateTime fromDate, DateTime toDate)
        {
            var moodEntries = await _context.MoodEntries
                .Where(e => e.UserId == userId && e.Date >= fromDate && e.Date <= toDate)
                .OrderBy(e => e.Date)
                .ToListAsync();

            if (!moodEntries.Any())
            {
                return new AIInsight
                {
                    UserId = userId,
                    InsightType = "mood_pattern",
                    Title = "Mood Pattern Analysis",
                    Content = "Not enough mood data available for analysis. Start tracking your mood daily to get insights!",
                    GeneratedAt = DateTime.UtcNow
                };
            }

            var dataSummary = new
            {
                period = $"{fromDate:yyyy-MM-dd} to {toDate:yyyy-MM-dd}",
                entryCount = moodEntries.Count,
                averageRating = moodEntries.Average(e => e.MoodRating),
                highestRating = moodEntries.Max(e => e.MoodRating),
                lowestRating = moodEntries.Min(e => e.MoodRating),
                moodDistribution = moodEntries.GroupBy(e => e.MoodRating).ToDictionary(g => g.Key, g => g.Count()),
                dailyAverages = moodEntries.GroupBy(e => e.Date.Date)
                    .ToDictionary(g => g.Key.ToString("yyyy-MM-dd"), g => g.Average(e => e.MoodRating))
            };

            var content = await GenerateInsightContentAsync("mood_pattern", JsonSerializer.Serialize(dataSummary));

            return new AIInsight
            {
                UserId = userId,
                InsightType = "mood_pattern",
                Title = "Mood Pattern Analysis",
                Content = content,
                DataSummary = JsonSerializer.Serialize(dataSummary),
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<AIInsight> GenerateFitnessTrendAnalysisAsync(int userId, DateTime fromDate, DateTime toDate)
        {
            var fitnessEntries = await _context.UserEntries
                .Where(e => e.UserId == userId && e.Date >= fromDate && e.Date <= toDate &&
                           (e.MetricType == "steps" || e.MetricType == "calories" || e.MetricType == "weight"))
                .ToListAsync();

            var dataSummary = new
            {
                period = $"{fromDate:yyyy-MM-dd} to {toDate:yyyy-MM-dd}",
                metrics = fitnessEntries.GroupBy(e => e.MetricType).ToDictionary(g => g.Key, g => new
                {
                    count = g.Count(),
                    average = g.Average(e => (double)e.Value),
                    max = g.Max(e => (double)e.Value),
                    min = g.Min(e => (double)e.Value),
                    trend = CalculateTrend(g.OrderBy(e => e.Date).Select(e => (double)e.Value).ToList())
                })
            };

            var content = await GenerateInsightContentAsync("fitness_trend", JsonSerializer.Serialize(dataSummary));

            return new AIInsight
            {
                UserId = userId,
                InsightType = "fitness_trend",
                Title = "Fitness Trend Analysis",
                Content = content,
                DataSummary = JsonSerializer.Serialize(dataSummary),
                GeneratedAt = DateTime.UtcNow
            };
        }

        public async Task<AIInsight> GenerateFinancialInsightAsync(int userId, DateTime fromDate, DateTime toDate)
        {
            var financialEntries = await _context.FinancialEntries
                .Where(e => e.UserId == userId && e.Date >= fromDate && e.Date <= toDate)
                .ToListAsync();

            var dataSummary = new
            {
                period = $"{fromDate:yyyy-MM-dd} to {toDate:yyyy-MM-dd}",
                income = financialEntries.Where(e => e.EntryType == "income").Sum(e => (double)e.Amount),
                expenses = financialEntries.Where(e => e.EntryType == "expense").Sum(e => (double)e.Amount),
                savings = financialEntries.Where(e => e.EntryType == "income").Sum(e => (double)e.Amount) -
                         financialEntries.Where(e => e.EntryType == "expense").Sum(e => (double)e.Amount),
                topExpenseCategories = financialEntries
                    .Where(e => e.EntryType == "expense")
                    .GroupBy(e => e.Category)
                    .OrderByDescending(g => g.Sum(e => (double)e.Amount))
                    .Take(5)
                    .ToDictionary(g => g.Key, g => g.Sum(e => (double)e.Amount))
            };

            var content = await GenerateInsightContentAsync("financial_insight", JsonSerializer.Serialize(dataSummary));

            return new AIInsight
            {
                UserId = userId,
                InsightType = "financial_insight",
                Title = "Financial Insight",
                Content = content,
                DataSummary = JsonSerializer.Serialize(dataSummary),
                GeneratedAt = DateTime.UtcNow
            };
        }

        private async Task<string> GenerateInsightContentAsync(string insightType, string dataSummary)
        {
            var openAIApiKey = _configuration["OpenAI:ApiKey"];
            
            if (string.IsNullOrEmpty(openAIApiKey))
            {
                // Fallback to rule-based insights
                return GenerateRuleBasedInsight(insightType, dataSummary);
            }

            try
            {
                var prompt = GeneratePrompt(insightType, dataSummary);
                
                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {openAIApiKey}");

                var requestBody = new
                {
                    model = "gpt-3.5-turbo",
                    messages = new[]
                    {
                        new { role = "system", content = "You are a helpful personal tracking assistant that provides insights based on user data." },
                        new { role = "user", content = prompt }
                    },
                    max_tokens = 500,
                    temperature = 0.7
                };

                var jsonContent = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
                var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", jsonContent);

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<OpenAIResponse>(responseContent);
                    return result?.choices?[0]?.message?.content ?? GenerateRuleBasedInsight(insightType, dataSummary);
                }
            }
            catch (Exception)
            {
                // Fall back to rule-based insight if API fails
            }

            return GenerateRuleBasedInsight(insightType, dataSummary);
        }

        private string GeneratePrompt(string insightType, string dataSummary)
        {
            return insightType switch
            {
                "weekly_summary" => $"Analyze this weekly personal tracking data and provide a friendly summary with insights and suggestions: {dataSummary}",
                "mood_pattern" => $"Analyze this mood tracking data and identify patterns, trends, and provide recommendations: {dataSummary}",
                "fitness_trend" => $"Analyze this fitness tracking data and provide insights on trends and recommendations for improvement: {dataSummary}",
                "financial_insight" => $"Analyze this financial data and provide insights on spending patterns and budget recommendations: {dataSummary}",
                _ => $"Analyze this personal tracking data and provide helpful insights: {dataSummary}"
            };
        }

        private string GenerateRuleBasedInsight(string insightType, string dataSummary)
        {
            return insightType switch
            {
                "weekly_summary" => "Your weekly activity shows consistent tracking habits. Keep up the great work!",
                "mood_pattern" => "Your mood patterns show good self-awareness. Continue tracking to identify what affects your mood.",
                "fitness_trend" => "Your fitness data shows you're making progress. Consider setting new goals to maintain momentum.",
                "financial_insight" => "Your financial tracking helps maintain awareness of spending patterns. Consider reviewing your largest expense categories.",
                _ => "Keep up the consistent tracking! Regular data entry helps build better habits and insights."
            };
        }

        private string CalculateTrend(List<double> values)
        {
            if (values.Count < 2) return "insufficient_data";

            var firstHalf = values.Take(values.Count / 2).Average();
            var secondHalf = values.Skip(values.Count / 2).Average();

            var percentChange = ((secondHalf - firstHalf) / firstHalf) * 100;

            return percentChange switch
            {
                > 5 => "increasing",
                < -5 => "decreasing",
                _ => "stable"
            };
        }
    }

    public class OpenAIResponse
    {
        public OpenAIChoice[]? choices { get; set; }
    }

    public class OpenAIChoice
    {
        public OpenAIMessage? message { get; set; }
    }

    public class OpenAIMessage
    {
        public string? content { get; set; }
    }
}