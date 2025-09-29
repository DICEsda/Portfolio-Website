using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class MoodEntriesController : BaseController
    {
        public MoodEntriesController(AppDbContext context) : base(context)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MoodEntry>>> GetMoodEntries(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.MoodEntries.Where(e => e.UserId == userId);

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
        public async Task<ActionResult<MoodEntry>> GetMoodEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.MoodEntries
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
        public async Task<ActionResult<MoodEntry>> CreateMoodEntry(MoodEntry entry)
        {
            try
            {
                entry.UserId = GetUserId();
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.MoodEntries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetMoodEntry), new { id = entry.Id }, entry);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMoodEntry(int id, MoodEntry entry)
        {
            try
            {
                var userId = GetUserId();
                var existingEntry = await _context.MoodEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (existingEntry == null)
                    return NotFound();

                existingEntry.MoodRating = entry.MoodRating;
                existingEntry.MoodLabel = entry.MoodLabel;
                existingEntry.Notes = entry.Notes;
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
        public async Task<IActionResult> DeleteMoodEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.MoodEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (entry == null)
                    return NotFound();

                _context.MoodEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("analytics")]
        public async Task<ActionResult<object>> GetMoodAnalytics(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.MoodEntries.Where(e => e.UserId == userId);

                if (fromDate.HasValue)
                    query = query.Where(e => e.Date >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(e => e.Date <= toDate.Value);

                var entries = await query.ToListAsync();

                if (!entries.Any())
                {
                    return Ok(new { averageMood = 0, totalEntries = 0, moodDistribution = new Dictionary<int, int>() });
                }

                var analytics = new
                {
                    averageMood = Math.Round(entries.Average(e => e.MoodRating), 1),
                    totalEntries = entries.Count,
                    moodDistribution = entries.GroupBy(e => e.MoodRating)
                        .ToDictionary(g => g.Key, g => g.Count()),
                    moodTrend = entries.OrderBy(e => e.Date)
                        .Select(e => new { date = e.Date.ToString("yyyy-MM-dd"), rating = e.MoodRating })
                        .ToList()
                };

                return Ok(analytics);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}