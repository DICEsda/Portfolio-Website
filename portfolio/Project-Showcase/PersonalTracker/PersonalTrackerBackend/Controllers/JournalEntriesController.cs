using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class JournalEntriesController : BaseController
    {
        public JournalEntriesController(AppDbContext context) : base(context)
        {
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JournalEntry>>> GetJournalEntries(
            [FromQuery] DateTime? fromDate = null,
            [FromQuery] DateTime? toDate = null,
            [FromQuery] string? searchTerm = null)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.JournalEntries.Where(e => e.UserId == userId);

                if (fromDate.HasValue)
                    query = query.Where(e => e.Date >= fromDate.Value);

                if (toDate.HasValue)
                    query = query.Where(e => e.Date <= toDate.Value);

                if (!string.IsNullOrEmpty(searchTerm))
                    query = query.Where(e => e.Title.Contains(searchTerm) || e.Content.Contains(searchTerm) || 
                                           (e.Tags != null && e.Tags.Contains(searchTerm)));

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
        public async Task<ActionResult<JournalEntry>> GetJournalEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.JournalEntries
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
        public async Task<ActionResult<JournalEntry>> CreateJournalEntry(JournalEntry entry)
        {
            try
            {
                entry.UserId = GetUserId();
                entry.CreatedAt = DateTime.UtcNow;
                entry.UpdatedAt = DateTime.UtcNow;

                _context.JournalEntries.Add(entry);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetJournalEntry), new { id = entry.Id }, entry);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateJournalEntry(int id, JournalEntry entry)
        {
            try
            {
                var userId = GetUserId();
                var existingEntry = await _context.JournalEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (existingEntry == null)
                    return NotFound();

                existingEntry.Title = entry.Title;
                existingEntry.Content = entry.Content;
                existingEntry.Tags = entry.Tags;
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
        public async Task<IActionResult> DeleteJournalEntry(int id)
        {
            try
            {
                var userId = GetUserId();
                var entry = await _context.JournalEntries
                    .FirstOrDefaultAsync(e => e.Id == id && e.UserId == userId);

                if (entry == null)
                    return NotFound();

                _context.JournalEntries.Remove(entry);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("tags")]
        public async Task<ActionResult<IEnumerable<string>>> GetAllTags()
        {
            try
            {
                var userId = GetUserId();
                var allTags = await _context.JournalEntries
                    .Where(e => e.UserId == userId && !string.IsNullOrEmpty(e.Tags))
                    .Select(e => e.Tags)
                    .ToListAsync();

                var tags = allTags
                    .SelectMany(tagString => tagString!.Split(',', StringSplitOptions.RemoveEmptyEntries))
                    .Select(tag => tag.Trim())
                    .Where(tag => !string.IsNullOrEmpty(tag))
                    .Distinct()
                    .OrderBy(tag => tag)
                    .ToList();

                return Ok(tags);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}