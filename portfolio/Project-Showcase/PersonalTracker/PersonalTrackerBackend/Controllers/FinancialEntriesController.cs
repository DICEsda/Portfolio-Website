using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class FinancialEntriesController : BaseController
    {
        public FinancialEntriesController(AppDbContext context) : base(context)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FinancialEntry>>> GetFinancialEntries(
            [FromQuery] string? entryType = null,
            [FromQuery] string? category = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.FinancialEntries.Where(e => e.UserId == userId);

                if (!string.IsNullOrEmpty(entryType))
                    query = query.Where(e => e.EntryType == entryType);

                if (!string.IsNullOrEmpty(category))
                    query = query.Where(e => e.Category == category);

                if (fromDate.HasValue)
                    query = query.Where(e => e.Date >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(e => e.Date <= toDate.Value);

                var entries = await query
                    .OrderByDescending(e => e.Date)
                    .ThenByDescending(e => e.CreatedAt)
                    .ToListAsync();

                return Ok(entries);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FinancialEntry>> GetFinancialEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.FinancialEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (entry == null)
                    return NotFound();

                return Ok(entry);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPost]
        public async Task<ActionResult<FinancialEntry>> CreateFinancialEntry(FinancialEntry entry)
        {
            try
            {
                entry.UserId = GetUserId();
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.FinancialEntries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetFinancialEntry), new { id = entry.Id }, entry);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateFinancialEntry(int id, FinancialEntry entry)
        {
            try
            {
                var userId = GetUserId();
                var existingEntry = await _context.FinancialEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (existingEntry == null)
                    return NotFound();

                existingEntry.EntryType = entry.EntryType;
                existingEntry.Category = entry.Category;
                existingEntry.Amount = entry.Amount;
                existingEntry.Currency = entry.Currency;
                existingEntry.Description = entry.Description;
                existingEntry.AccountName = entry.AccountName;
                existingEntry.Date = entry.Date;
                existingEntry.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFinancialEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.FinancialEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (entry == null)
                    return NotFound();

                _context.FinancialEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("summary")]
        public async Task<ActionResult<object>> GetFinancialSummary(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.FinancialEntries.Where(e => e.UserId == userId);

                if (fromDate.HasValue)
                    query = query.Where(e => e.Date >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(e => e.Date <= toDate.Value);

                var entries = await query.ToListAsync();

                var income = entries.Where(e => e.EntryType == "income").Sum(e => e.Amount);
                var expenses = entries.Where(e => e.EntryType == "expense").Sum(e => e.Amount);
                var assets = entries.Where(e => e.EntryType == "asset").Sum(e => e.Amount);
                var liabilities = entries.Where(e => e.EntryType == "liability").Sum(e => e.Amount);

                var summary = new
                {
                    income,
                    expenses,
                    netIncome = income - expenses,
                    assets,
                    liabilities,
                    netWorth = assets - liabilities,
                    totalTransactions = entries.Count,
                    expensesByCategory = entries
                        .Where(e => e.EntryType == "expense")
                        .GroupBy(e => e.Category)
                        .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount)),
                    incomeByCategory = entries
                        .Where(e => e.EntryType == "income")
                        .GroupBy(e => e.Category)
                        .ToDictionary(g => g.Key, g => g.Sum(e => e.Amount))
                };

                return Ok(summary);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("categories")]
        public async Task<ActionResult<object>> GetCategories()
        {
            try
            {
                var userId = GetUserId();
                var categories = await _context.FinancialEntries
                    .Where(e => e.UserId == userId)
                    .GroupBy(e => e.EntryType)
                    .ToDictionaryAsync(
                        g => g.Key,
                        g => g.Select(e => e.Category).Distinct().OrderBy(c => c).ToList()
                    );

                return Ok(categories);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}