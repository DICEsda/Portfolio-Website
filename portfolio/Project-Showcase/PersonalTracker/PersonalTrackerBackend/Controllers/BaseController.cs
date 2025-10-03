using Microsoft.AspNetCore.Mvc;
using PersonalTrackerBackend.Data;

namespace PersonalTrackerBackend.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected readonly AppDbContext _context;

        protected BaseController(AppDbContext context)
        {
            _context = context;
        }

        protected int GetUserId()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier);
            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out int userId))
            {
                return userId;
            }
            
            // Fallback for development/testing
            return 1;
        }

        protected IActionResult HandleException(Exception ex)
        {
            // Log the exception here
            return StatusCode(500, new { message = "An error occurred while processing your request." });
        }
    }
}