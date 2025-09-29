using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class UserEntriesController : BaseController
    {
        public UserEntriesController(AppDbContext context) : base(context)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserEntry>>> GetUserEntries(
            [FromQuery] string? metricType = null,
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.UserEntries.Where(e => e.UserId == userId);

                if (!string.IsNullOrEmpty(metricType))
                    query = query.Where(e => e.MetricType == metricType);

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
        public async Task<ActionResult<UserEntry>> GetUserEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.UserEntries
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
        public async Task<ActionResult<UserEntry>> CreateUserEntry(UserEntry entry)
        {
            try
            {
                entry.UserId = GetUserId();
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.UserEntries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetUserEntry), new { id = entry.Id }, entry);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUserEntry(int id, UserEntry entry)
        {
            try
            {
                var userId = GetUserId();
                var existingEntry = await _context.UserEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (existingEntry == null)
                    return NotFound();

                existingEntry.MetricType = entry.MetricType;
                existingEntry.Value = entry.Value;
                existingEntry.Unit = entry.Unit;
                existingEntry.Date = entry.Date;
                existingEntry.Notes = entry.Notes;
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
        public async Task<IActionResult> DeleteUserEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.UserEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (entry == null)
                    return NotFound();

                _context.UserEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("metrics")]
        public async Task<ActionResult<IEnumerable<string>>> GetAvailableMetrics()
        {
            try
            {
                var userId = GetUserId();
                var metrics = await _context.UserEntries
                    .Where(e => e.UserId == userId)
                    .Select(e => e.MetricType)
                    .Distinct()
                    .OrderBy(m => m)
                    .ToListAsync();

                return Ok(metrics);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}