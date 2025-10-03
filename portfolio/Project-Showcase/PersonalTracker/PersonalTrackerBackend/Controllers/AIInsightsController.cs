using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalTrackerBackend.Data;
using PersonalTrackerBackend.Data.Models;
using PersonalTrackerBackend.Services;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    public class AIInsightsController : BaseController
    {
        private readonly IAIService _aiService;

        public AIInsightsController(AppDbContext context, IAIService aiService) : base(context)
        {
            _aiService = aiService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AIInsight>>> GetAIInsights(
            [FromQuery] string? insightType = null,
            [FromQuery] bool includeRead = true)
        {
            try
            {
                var userId = GetUserId();
                var query = _context.AIInsights.Where(i => i.UserId == userId);

                if (!string.IsNullOrEmpty(insightType))
                    query = query.Where(i => i.InsightType == insightType);

                if (!includeRead)
                    query = query.Where(i => !i.IsRead);

                // Filter out expired insights
                query = query.Where(i => i.ExpiresAt == null || i.ExpiresAt > DateTime.UtcNow);

                var insights = await query
                    .OrderByDescending(i => i.GeneratedAt)
                    .ToListAsync();

                return Ok(insights);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AIInsight>> GetAIInsight(int id)
        {
            try
            {
                var userId = GetUserId();
                var insight = await _context.AIInsights
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (insight == null)
                    return NotFound();

                return Ok(insight);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPost("{id}/mark-read")]
        public async Task<IActionResult> MarkAsRead(int id)
        {
            try
            {
                var userId = GetUserId();
                var insight = await _context.AIInsights
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (insight == null)
                    return NotFound();

                insight.IsRead = true;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpPost("generate")]
        public async Task<ActionResult<AIInsight>> GenerateInsight([FromBody] GenerateInsightRequest request)
        {
            try
            {
                var userId = GetUserId();
                AIInsight insight;

                switch (request.InsightType.ToLower())
                {
                    case "weekly_summary":
                        insight = await _aiService.GenerateWeeklySummaryAsync(userId);
                        break;
                    case "mood_pattern":
                        var moodFromDate = request.FromDate ?? DateTime.UtcNow.AddDays(-30);
                        var moodToDate = request.ToDate ?? DateTime.UtcNow;
                        insight = await _aiService.GenerateMoodPatternAnalysisAsync(userId, moodFromDate, moodToDate);
                        break;
                    case "fitness_trend":
                        var fitnessFromDate = request.FromDate ?? DateTime.UtcNow.AddDays(-30);
                        var fitnessToDate = request.ToDate ?? DateTime.UtcNow;
                        insight = await _aiService.GenerateFitnessTrendAnalysisAsync(userId, fitnessFromDate, fitnessToDate);
                        break;
                    case "financial_insight":
                        var financeFromDate = request.FromDate ?? DateTime.UtcNow.AddDays(-30);
                        var financeToDate = request.ToDate ?? DateTime.UtcNow;
                        insight = await _aiService.GenerateFinancialInsightAsync(userId, financeFromDate, financeToDate);
                        break;
                    default:
                        return BadRequest(new { message = "Invalid insight type" });
                }

                _context.AIInsights.Add(insight);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetAIInsight), new { id = insight.Id }, insight);
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAIInsight(int id)
        {
            try
            {
                var userId = GetUserId();
                var insight = await _context.AIInsights
                    .FirstOrDefaultAsync(i => i.Id == id && i.UserId == userId);

                if (insight == null)
                    return NotFound();

                _context.AIInsights.Remove(insight);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return HandleException(ex);
            }
        }
    }

    public class GenerateInsightRequest
    {
        public string InsightType { get; set; } = string.Empty;
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
    }
}