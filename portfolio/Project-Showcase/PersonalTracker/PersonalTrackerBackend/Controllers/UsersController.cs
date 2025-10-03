using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class UsersController : BaseController
    {
        public UsersController(AppDbContext context) : base(context)
        {
        }

        [HttpGet("me")]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            try
            {
                var userId = GetUserId();
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                    return NotFound();

                return Ok(user);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPut("me")]
        public async Task<IActionResult> UpdateCurrentUser(User userUpdate)
        {
            try
            {
                var userId = GetUserId();
                var user = await _context.Users.FindAsync(userId);

                if (user == null)
                    return NotFound();

                user.Name = userUpdate.Name;
                user.UpdatedAt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPost("create-or-update")]
        public async Task<ActionResult<User>> CreateOrUpdateUser(User userInfo)
        {
            try
            {
                var existingUser = await _context.Users
                    .FirstOrDefaultAsync(u => u.GoogleId == userInfo.GoogleId);

                if (existingUser != null)
                {
                    // Update existing user
                    existingUser.Email = userInfo.Email;
                    existingUser.Name = userInfo.Name;
                    existingUser.ProfilePictureUrl = userInfo.ProfilePictureUrl;
                    existingUser.UpdatedAt = DateTime.UtcNow;

                    await _context.SaveChangesAsync();
                    return Ok(existingUser);
                }
                else
                {
                    // Create new user
                    userInfo.CreatedAt = DateTime.UtcNow;
                    userInfo.UpdatedAt = DateTime.UtcNow;

                    _context.Users.Add(userInfo);
                    await _context.SaveChangesAsync();

                    return CreatedAtAction(nameof(GetCurrentUser), null, userInfo);
                }
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("dashboard-stats")]
        public async Task<ActionResult<object>> GetDashboardStats()
        {
            try
            {
                var userId = GetUserId();
                var today = DateTime.UtcNow.Date;
                var weekAgo = today.AddDays(-7);
                var monthAgo = today.AddDays(-30);

                var stats = new
                {
                    totalUserEntries = await _context.UserEntries.CountAsync(e => e.UserId == userId),
                    totalMoodEntries = await _context.MoodEntries.CountAsync(e => e.UserId == userId),
                    totalJournalEntries = await _context.JournalEntries.CountAsync(e => e.UserId == userId),
                    totalFinancialEntries = await _context.FinancialEntries.CountAsync(e => e.UserId == userId),
                    
                    recentActivity = new
                    {
                        entriesThisWeek = await _context.UserEntries
                            .CountAsync(e => e.UserId == userId && e.Date >= weekAgo),
                        moodEntriesThisWeek = await _context.MoodEntries
                            .CountAsync(e => e.UserId == userId && e.Date >= weekAgo),
                        journalEntriesThisWeek = await _context.JournalEntries
                            .CountAsync(e => e.UserId == userId && e.Date >= weekAgo),
                        financialEntriesThisWeek = await _context.FinancialEntries
                            .CountAsync(e => e.UserId == userId && e.Date >= weekAgo)
                    },

                    averageMoodThisMonth = await _context.MoodEntries
                        .Where(e => e.UserId == userId && e.Date >= monthAgo)
                        .AverageAsync(e => (double?)e.MoodRating) ?? 0
                };

                return Ok(stats);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }
}