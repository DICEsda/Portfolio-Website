using Microsoft.AspNetCore.Mvc;
using PersonalTrackerBackend.Services;
using PersonalTrackerBackend.Models;

namespace PersonalTrackerBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class GoogleCalendarController : ControllerBase
{
    private readonly IGoogleCalendarService _calendarService;

    public GoogleCalendarController(IGoogleCalendarService calendarService)
    {
        _calendarService = calendarService;
    }

    [HttpGet("calendars")]
    public async Task<ActionResult<CalendarListResponse>> GetCalendars([FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var accessToken = ExtractAccessToken(authorization);
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized("Access token is required");

            var calendars = await _calendarService.GetCalendarsAsync(accessToken);
            return Ok(calendars);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpGet("calendars/{calendarId}/events")]
    public async Task<ActionResult<EventsResponse>> GetEvents(
        string calendarId,
        [FromQuery] DateTime? startDate,
        [FromQuery] DateTime? endDate,
        [FromQuery] string? pageToken,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var accessToken = ExtractAccessToken(authorization);
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized("Access token is required");

            var events = await _calendarService.GetEventsAsync(calendarId, startDate, endDate, pageToken);
            return Ok(events);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPost("calendars/{calendarId}/events")]
    public async Task<ActionResult<GoogleCalendarEvent>> CreateEvent(
        string calendarId,
        [FromBody] CreateEventRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var accessToken = ExtractAccessToken(authorization);
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized("Access token is required");

            var createdEvent = await _calendarService.CreateEventAsync(calendarId, request, accessToken);
            return CreatedAtAction(nameof(GetEvents), new { calendarId }, createdEvent);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpPut("calendars/{calendarId}/events/{eventId}")]
    public async Task<ActionResult<GoogleCalendarEvent>> UpdateEvent(
        string calendarId,
        string eventId,
        [FromBody] UpdateEventRequest request,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var accessToken = ExtractAccessToken(authorization);
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized("Access token is required");

            request.Id = eventId;
            var updatedEvent = await _calendarService.UpdateEventAsync(calendarId, request, accessToken);
            return Ok(updatedEvent);
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    [HttpDelete("calendars/{calendarId}/events/{eventId}")]
    public async Task<ActionResult> DeleteEvent(
        string calendarId,
        string eventId,
        [FromHeader(Name = "Authorization")] string authorization)
    {
        try
        {
            var accessToken = ExtractAccessToken(authorization);
            if (string.IsNullOrEmpty(accessToken))
                return Unauthorized("Access token is required");

            await _calendarService.DeleteEventAsync(calendarId, eventId, accessToken);
            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Internal server error: {ex.Message}");
        }
    }

    private static string ExtractAccessToken(string authorization)
    {
        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
            return string.Empty;

        return authorization.Substring("Bearer ".Length);
    }
} 