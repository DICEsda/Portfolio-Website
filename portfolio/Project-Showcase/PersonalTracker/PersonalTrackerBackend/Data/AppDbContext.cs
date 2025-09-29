using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Account> Accounts { get; set; }
        public DbSet<AccountBalance> AccountBalances { get; set; }
        public DbSet<Transaction> Transactions { get; set; }
        public DbSet<RequestLog> RequestLogs { get; set; }
        
        // Personal Tracker entities
        public DbSet<User> Users { get; set; }
        public DbSet<UserEntry> UserEntries { get; set; }
        public DbSet<MoodEntry> MoodEntries { get; set; }
        public DbSet<JournalEntry> JournalEntries { get; set; }
        public DbSet<FinancialEntry> FinancialEntries { get; set; }
        public DbSet<AIInsight> AIInsights { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure Account entity
            modelBuilder.Entity<Account>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AccountId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Name).HasMaxLength(200);
                entity.Property(e => e.OwnerName).HasMaxLength(200);
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Type).HasMaxLength(50);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.BankId).HasMaxLength(100);
                entity.Property(e => e.RequisitionId).HasMaxLength(100);
                
                // Create unique index on AccountId
                entity.HasIndex(e => e.AccountId).IsUnique();
            });

            // Configure AccountBalance entity
            modelBuilder.Entity<AccountBalance>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AccountId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Type).HasMaxLength(50);
                
                // Create index on AccountId and Date for efficient queries
                entity.HasIndex(e => new { e.AccountId, e.Date });
            });

            // Configure Transaction entity
            modelBuilder.Entity<Transaction>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.TransactionId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.AccountId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Currency).HasMaxLength(10);
                entity.Property(e => e.Description).HasMaxLength(500);
                entity.Property(e => e.MerchantName).HasMaxLength(200);
                entity.Property(e => e.Category).HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50);
                
                // Create unique index on TransactionId
                entity.HasIndex(e => e.TransactionId).IsUnique();
                
                // Create index on AccountId and Date for efficient queries
                entity.HasIndex(e => new { e.AccountId, e.Date });
            });

            // Configure RequestLog entity
            modelBuilder.Entity<RequestLog>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.AccountId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Endpoint).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Status).HasMaxLength(50);
                entity.Property(e => e.ErrorMessage).HasMaxLength(1000);
                
                // Create index on AccountId and Date for efficient queries
                entity.HasIndex(e => new { e.AccountId, e.Date });
            });

            // Configure User entity
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.GoogleId).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Name).HasMaxLength(200);
                entity.Property(e => e.ProfilePictureUrl).HasMaxLength(500);
                
                entity.HasIndex(e => e.GoogleId).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
            });

            // Configure UserEntry entity
            modelBuilder.Entity<UserEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MetricType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Unit).HasMaxLength(20);
                entity.Property(e => e.Notes).HasMaxLength(500);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.UserEntries)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.UserId, e.Date, e.MetricType });
            });

            // Configure MoodEntry entity
            modelBuilder.Entity<MoodEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.MoodRating).IsRequired();
                entity.Property(e => e.MoodLabel).HasMaxLength(100);
                entity.Property(e => e.Notes).HasMaxLength(1000);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.MoodEntries)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.UserId, e.Date });
            });

            // Configure JournalEntry entity
            modelBuilder.Entity<JournalEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.Tags).HasMaxLength(500);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.JournalEntries)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.UserId, e.Date });
            });

            // Configure FinancialEntry entity
            modelBuilder.Entity<FinancialEntry>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.EntryType).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Category).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Currency).IsRequired().HasMaxLength(10);
                entity.Property(e => e.Description).HasMaxLength(200);
                entity.Property(e => e.AccountName).HasMaxLength(100);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.FinancialEntries)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.UserId, e.Date, e.EntryType });
            });

            // Configure AIInsight entity
            modelBuilder.Entity<AIInsight>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.InsightType).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.DataSummary).HasMaxLength(1000);
                
                entity.HasOne(e => e.User)
                    .WithMany(u => u.AIInsights)
                    .HasForeignKey(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.HasIndex(e => new { e.UserId, e.GeneratedAt });
            });
        }
    }
} 