using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data.Models;
using System.Text.Json;

namespace PersonalTrackerBackend.Data
{
    public class DataService
    {
        private readonly AppDbContext _context;

        public DataService(AppDbContext context)
        {
            _context = context;
        }

        // Account operations
        public async Task<Account?> GetAccountAsync(string accountId)
        {
            return await _context.Accounts
                .FirstOrDefaultAsync(a => a.AccountId == accountId);
        }

        public async Task<Account> CreateOrUpdateAccountAsync(string accountId, object accountData)
        {
            var account = await GetAccountAsync(accountId);
            
            if (account == null)
            {
                account = new Account { AccountId = accountId };
                _context.Accounts.Add(account);
            }

            // Update account properties from the API response
            var jsonElement = JsonSerializer.SerializeToElement(accountData);
            
            if (jsonElement.TryGetProperty("name", out var nameElement))
                account.Name = nameElement.GetString();
            
            if (jsonElement.TryGetProperty("ownerName", out var ownerElement))
                account.OwnerName = ownerElement.GetString();
            
            if (jsonElement.TryGetProperty("currency", out var currencyElement))
                account.Currency = currencyElement.GetString();
            
            if (jsonElement.TryGetProperty("type", out var typeElement))
                account.Type = typeElement.GetString();
            
            if (jsonElement.TryGetProperty("status", out var statusElement))
                account.Status = statusElement.GetString();
            
            if (jsonElement.TryGetProperty("bank_id", out var bankIdElement))
                account.BankId = bankIdElement.GetString();

            account.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            
            return account;
        }

        // Balance operations
        public async Task<List<AccountBalance>> GetBalancesAsync(string accountId, DateTime? fromDate = null)
        {
            var query = _context.AccountBalances
                .Where(b => b.AccountId == accountId)
                .OrderByDescending(b => b.Date)
                .AsQueryable();

            if (fromDate.HasValue)
                query = query.Where(b => b.Date >= fromDate.Value);

            return await query.ToListAsync();
        }

        public async Task<AccountBalance?> GetLatestBalanceAsync(string accountId)
        {
            return await _context.AccountBalances
                .Where(b => b.AccountId == accountId)
                .OrderByDescending(b => b.Date)
                .FirstOrDefaultAsync();
        }

        public async Task SaveBalancesAsync(string accountId, List<object> balancesData)
        {
            var today = DateTime.UtcNow.Date;
            
            // Remove existing balances for today to avoid duplicates
            var existingBalances = await _context.AccountBalances
                .Where(b => b.AccountId == accountId && b.Date.Date == today)
                .ToListAsync();
            
            _context.AccountBalances.RemoveRange(existingBalances);

            // Add new balances
            foreach (var balanceData in balancesData)
            {
                var jsonElement = JsonSerializer.SerializeToElement(balanceData);
                
                var balance = new AccountBalance
                {
                    AccountId = accountId,
                    Date = DateTime.UtcNow
                };

                if (jsonElement.TryGetProperty("balanceAmount", out var amountElement))
                {
                    if (amountElement.TryGetProperty("amount", out var amountValue))
                    {
                        if (decimal.TryParse(amountValue.GetString(), out var amount))
                            balance.Balance = amount;
                    }
                    
                    if (amountElement.TryGetProperty("currency", out var currencyElement))
                        balance.Currency = currencyElement.GetString();
                }

                if (jsonElement.TryGetProperty("balanceType", out var typeElement))
                    balance.Type = typeElement.GetString();

                _context.AccountBalances.Add(balance);
            }

            await _context.SaveChangesAsync();
        }

        // Transaction operations
        public async Task<List<Transaction>> GetTransactionsAsync(string accountId, DateTime? fromDate = null, int? limit = null)
        {
            var query = _context.Transactions
                .Where(t => t.AccountId == accountId)
                .OrderByDescending(t => t.Date)
                .AsQueryable();

            if (fromDate.HasValue)
                query = query.Where(t => t.Date >= fromDate.Value);

            if (limit.HasValue)
                query = query.Take(limit.Value);

            return await query.ToListAsync();
        }

        public async Task SaveTransactionsAsync(string accountId, List<object> transactionsData)
        {
            var today = DateTime.UtcNow.Date;
            
            // Remove existing transactions for today to avoid duplicates
            var existingTransactions = await _context.Transactions
                .Where(t => t.AccountId == accountId && t.Date.Date == today)
                .ToListAsync();
            
            _context.Transactions.RemoveRange(existingTransactions);

            // Add new transactions
            foreach (var transactionData in transactionsData)
            {
                var jsonElement = JsonSerializer.SerializeToElement(transactionData);
                
                var transaction = new Transaction
                {
                    AccountId = accountId
                };

                if (jsonElement.TryGetProperty("transactionId", out var idElement))
                    transaction.TransactionId = idElement.GetString() ?? string.Empty;

                if (jsonElement.TryGetProperty("transactionAmount", out var amountElement))
                {
                    if (amountElement.TryGetProperty("amount", out var amountValue))
                    {
                        if (decimal.TryParse(amountValue.GetString(), out var amount))
                            transaction.Amount = amount;
                    }
                    
                    if (amountElement.TryGetProperty("currency", out var currencyElement))
                        transaction.Currency = currencyElement.GetString();
                }

                if (jsonElement.TryGetProperty("description", out var descElement))
                    transaction.Description = descElement.GetString();

                if (jsonElement.TryGetProperty("merchantName", out var merchantElement))
                    transaction.MerchantName = merchantElement.GetString();

                if (jsonElement.TryGetProperty("category", out var categoryElement))
                    transaction.Category = categoryElement.GetString();

                if (jsonElement.TryGetProperty("status", out var statusElement))
                    transaction.Status = statusElement.GetString();

                if (jsonElement.TryGetProperty("bookingDate", out var dateElement))
                {
                    if (DateTime.TryParse(dateElement.GetString(), out var date))
                        transaction.Date = date;
                }

                _context.Transactions.Add(transaction);
            }

            await _context.SaveChangesAsync();
        }

        // Request logging
        public async Task LogRequestAsync(string accountId, string endpoint, string status, int? statusCode = null, string? errorMessage = null)
        {
            var log = new RequestLog
            {
                AccountId = accountId,
                Endpoint = endpoint,
                Status = status,
                StatusCode = statusCode,
                ErrorMessage = errorMessage,
                Date = DateTime.UtcNow
            };

            _context.RequestLogs.Add(log);
            await _context.SaveChangesAsync();
        }

        public async Task<List<RequestLog>> GetRequestLogsAsync(string accountId, DateTime? fromDate = null)
        {
            var query = _context.RequestLogs
                .Where(r => r.AccountId == accountId)
                .OrderByDescending(r => r.Date)
                .AsQueryable();

            if (fromDate.HasValue)
                query = query.Where(r => r.Date >= fromDate.Value);

            return await query.ToListAsync();
        }

        public async Task<int> GetRequestCountAsync(string accountId, DateTime fromDate)
        {
            return await _context.RequestLogs
                .CountAsync(r => r.AccountId == accountId && r.Date >= fromDate);
        }

        // Database initialization
        public async Task EnsureDatabaseCreatedAsync()
        {
            await _context.Database.EnsureCreatedAsync();
        }
    }
} 