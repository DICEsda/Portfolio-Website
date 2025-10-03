using PersonalTrackerBackend.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace PersonalTrackerBackend.Data
{
    public static class SeedData
    {
        public static async Task SeedAsync(AppDbContext context)
        {
            // Ensure database is created
            await context.Database.EnsureCreatedAsync();

            // Check if we already have data
            if (await context.Users.AnyAsync())
            {
                return; // Database has been seeded
            }

            // Create sample user
            var sampleUser = new User
            {
                GoogleId = "sample_google_id_123",
                Email = "demo@example.com",
                Name = "Demo User",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            context.Users.Add(sampleUser);
            await context.SaveChangesAsync();

            // Get the created user's ID
            var userId = sampleUser.Id;

            // Sample User Entries
            var userEntries = new List<UserEntry>
            {
                new UserEntry { UserId = userId, MetricType = "steps", Value = 8000, Unit = "steps", Date = DateTime.UtcNow.AddDays(-6), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 9500, Unit = "steps", Date = DateTime.UtcNow.AddDays(-5), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 12000, Unit = "steps", Date = DateTime.UtcNow.AddDays(-4), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 11000, Unit = "steps", Date = DateTime.UtcNow.AddDays(-3), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 10234, Unit = "steps", Date = DateTime.UtcNow.AddDays(-2), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 9000, Unit = "steps", Date = DateTime.UtcNow.AddDays(-1), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "steps", Value = 10500, Unit = "steps", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new UserEntry { UserId = userId, MetricType = "calories", Value = 2100, Unit = "cal", Date = DateTime.UtcNow.AddDays(-6), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2200, Unit = "cal", Date = DateTime.UtcNow.AddDays(-5), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2300, Unit = "cal", Date = DateTime.UtcNow.AddDays(-4), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2250, Unit = "cal", Date = DateTime.UtcNow.AddDays(-3), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2180, Unit = "cal", Date = DateTime.UtcNow.AddDays(-2), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2000, Unit = "cal", Date = DateTime.UtcNow.AddDays(-1), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "calories", Value = 2150, Unit = "cal", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },

                new UserEntry { UserId = userId, MetricType = "weight", Value = 75.2m, Unit = "kg", Date = DateTime.UtcNow.AddDays(-6), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "weight", Value = 75.0m, Unit = "kg", Date = DateTime.UtcNow.AddDays(-3), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new UserEntry { UserId = userId, MetricType = "weight", Value = 74.8m, Unit = "kg", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            };

            // Sample Mood Entries
            var moodEntries = new List<MoodEntry>
            {
                new MoodEntry { UserId = userId, MoodRating = 4, MoodLabel = "Good", Date = DateTime.UtcNow.AddDays(-6), Notes = "Had a productive day at work", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 6, MoodLabel = "Happy", Date = DateTime.UtcNow.AddDays(-5), Notes = "Great workout session", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 5, MoodLabel = "Neutral", Date = DateTime.UtcNow.AddDays(-4), Notes = "Regular day, nothing special", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 7, MoodLabel = "Very Happy", Date = DateTime.UtcNow.AddDays(-3), Notes = "Spent time with friends", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 3, MoodLabel = "Tired", Date = DateTime.UtcNow.AddDays(-2), Notes = "Didn't sleep well", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 8, MoodLabel = "Excellent", Date = DateTime.UtcNow.AddDays(-1), Notes = "Accomplished my goals", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new MoodEntry { UserId = userId, MoodRating = 6, MoodLabel = "Good", Date = DateTime.UtcNow, Notes = "Feeling optimistic", CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            };

            // Sample Journal Entries
            var journalEntries = new List<JournalEntry>
            {
                new JournalEntry 
                { 
                    UserId = userId, 
                    Title = "Morning Reflections", 
                    Content = "Started the day with meditation and felt really centered. Planning to tackle some challenging tasks today.", 
                    Tags = "meditation,morning,planning",
                    Date = DateTime.UtcNow.AddDays(-2), 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                },
                new JournalEntry 
                { 
                    UserId = userId, 
                    Title = "Weekend Plans", 
                    Content = "Looking forward to hiking this weekend. Need to prepare gear and check the weather forecast.", 
                    Tags = "weekend,hiking,outdoors",
                    Date = DateTime.UtcNow.AddDays(-1), 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                },
                new JournalEntry 
                { 
                    UserId = userId, 
                    Title = "Gratitude List", 
                    Content = "Grateful for good health, supportive family, and the opportunity to learn new things every day.", 
                    Tags = "gratitude,family,health",
                    Date = DateTime.UtcNow, 
                    CreatedAt = DateTime.UtcNow, 
                    UpdatedAt = DateTime.UtcNow 
                },
            };

            // Sample Financial Entries
            var financialEntries = new List<FinancialEntry>
            {
                // Income
                new FinancialEntry { UserId = userId, EntryType = "income", Category = "Salary", Amount = 4500, Currency = "USD", Description = "Monthly salary", Date = DateTime.UtcNow.AddDays(-30), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "income", Category = "Freelance", Amount = 500, Currency = "USD", Description = "Web development project", Date = DateTime.UtcNow.AddDays(-20), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // Expenses
                new FinancialEntry { UserId = userId, EntryType = "expense", Category = "Rent", Amount = 1200, Currency = "USD", Description = "Monthly rent", Date = DateTime.UtcNow.AddDays(-25), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "expense", Category = "Groceries", Amount = 150, Currency = "USD", Description = "Weekly groceries", Date = DateTime.UtcNow.AddDays(-7), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "expense", Category = "Transportation", Amount = 80, Currency = "USD", Description = "Gas and parking", Date = DateTime.UtcNow.AddDays(-5), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "expense", Category = "Entertainment", Amount = 60, Currency = "USD", Description = "Movie and dinner", Date = DateTime.UtcNow.AddDays(-3), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "expense", Category = "Utilities", Amount = 120, Currency = "USD", Description = "Electricity and internet", Date = DateTime.UtcNow.AddDays(-2), CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // Assets
                new FinancialEntry { UserId = userId, EntryType = "asset", Category = "Savings Account", Amount = 15000, Currency = "USD", Description = "Emergency fund", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "asset", Category = "Investment Account", Amount = 8000, Currency = "USD", Description = "Stock portfolio", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "asset", Category = "Checking Account", Amount = 2000, Currency = "USD", Description = "Daily expenses account", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                
                // Liabilities
                new FinancialEntry { UserId = userId, EntryType = "liability", Category = "Credit Card", Amount = 2500, Currency = "USD", Description = "Credit card debt", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
                new FinancialEntry { UserId = userId, EntryType = "liability", Category = "Student Loan", Amount = 5500, Currency = "USD", Description = "Education loan", Date = DateTime.UtcNow, CreatedAt = DateTime.UtcNow, UpdatedAt = DateTime.UtcNow },
            };

            // Add all sample data
            context.UserEntries.AddRange(userEntries);
            context.MoodEntries.AddRange(moodEntries);
            context.JournalEntries.AddRange(journalEntries);
            context.FinancialEntries.AddRange(financialEntries);

            await context.SaveChangesAsync();
        }
    }
}