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
        }
    }
} 