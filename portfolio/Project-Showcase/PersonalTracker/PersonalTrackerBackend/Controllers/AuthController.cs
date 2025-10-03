using Microsoft.AspNetCore.Mvc;
using PersonalTrackerBackend.Services;

namespace PersonalTrackerBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("google")]
        public async Task<IActionResult> GoogleAuth([FromBody] GoogleAuthRequest request)
        {
            try
            {
                var result = await _authService.AuthenticateGoogleUserAsync(request.Token);

                if (!result.Success)
                    return BadRequest(new { message = result.Message });

                return Ok(new
                {
                    token = result.Token,
                    user = new
                    {
                        id = result.User?.Id,
                        email = result.User?.Email,
                        name = result.User?.Name,
                        profilePicture = result.User?.ProfilePictureUrl
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Authentication failed", error = ex.Message });
            }
        }

        [HttpPost("refresh")]
        public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
        {
            try
            {
                var principal = await _authService.ValidateTokenAsync(request.Token);

                if (principal == null)
                    return Unauthorized(new { message = "Invalid token" });

                // For now, just return the same token. In a production app, 
                // you'd implement proper refresh token logic
                return Ok(new { token = request.Token });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Token refresh failed", error = ex.Message });
            }
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken([FromBody] ValidateTokenRequest request)
        {
            try
            {
                var principal = await _authService.ValidateTokenAsync(request.Token);

                if (principal == null)
                    return Unauthorized(new { message = "Invalid token" });

                return Ok(new { valid = true, userId = principal.FindFirst("sub")?.Value });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Token validation failed", error = ex.Message });
            }
        }
    }

    public class GoogleAuthRequest
    {
        public string Token { get; set; } = string.Empty;
    }

    public class RefreshTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }

    public class ValidateTokenRequest
    {
        public string Token { get; set; } = string.Empty;
    }
}