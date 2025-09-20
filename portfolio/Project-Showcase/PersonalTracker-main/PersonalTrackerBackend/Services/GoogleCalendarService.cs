using Google.Apis.Calendar.v3;
using Google.Apis.Calendar.v3.Data;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Services;
using PersonalTrackerBackend.Models;
using Microsoft.Extensions.Configuration;

namespace PersonalTrackerBackend.Services;

public interface IGoogleCalendarService
{
    Task<CalendarListResponse> GetCalendarsAsync(string accessToken);
    Task<EventsResponse> GetEventsAsync(string calendarId, DateTime? startDate = null, DateTime? endDate = null, string? pageToken = null);
    Task<GoogleCalendarEvent> CreateEventAsync(string calendarId, CreateEventRequest request, string accessToken);
    Task<GoogleCalendarEvent> UpdateEventAsync(string calendarId, UpdateEventRequest request, string accessToken);
    Task DeleteEventAsync(string calendarId, string eventId, string accessToken);
}

public class GoogleCalendarService : IGoogleCalendarService
{
    private readonly IConfiguration _configuration;

    public GoogleCalendarService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    private CalendarService CreateCalendarService(string accessToken)
    {
        var credential = GoogleCredential.FromAccessToken(accessToken);
        
        return new CalendarService(new BaseClientService.Initializer
        {
            HttpClientInitializer = credential,
            ApplicationName = _configuration["GoogleCalendar:ApplicationName"]
        });
    }

    public async Task<CalendarListResponse> GetCalendarsAsync(string accessToken)
    {
        var service = CreateCalendarService(accessToken);
        var calendarList = await service.CalendarList.List().ExecuteAsync();

        var calendars = calendarList.Items?.Select(c => new CalendarInfo
        {
            Id = c.Id,
            Summary = c.Summary,
            Description = c.Description ?? string.Empty,
            Primary = c.Primary ?? false,
            AccessRole = c.AccessRole
        }).ToList() ?? new List<CalendarInfo>();

        return new CalendarListResponse { Calendars = calendars };
    }

    public async Task<EventsResponse> GetEventsAsync(string calendarId, DateTime? startDate = null, DateTime? endDate = null, string? pageToken = null)
    {
        var service = CreateCalendarService(""); // We'll need to handle auth differently
        var request = service.Events.List(calendarId);
        
        if (startDate.HasValue)
            request.TimeMinDateTimeOffset = startDate.Value;
        if (endDate.HasValue)
            request.TimeMaxDateTimeOffset = endDate.Value;
        if (!string.IsNullOrEmpty(pageToken))
            request.PageToken = pageToken;

        request.OrderBy = EventsResource.ListRequest.OrderByEnum.StartTime;
        request.SingleEvents = true;

        var events = await request.ExecuteAsync();

        var calendarEvents = events.Items?.Select(e => new GoogleCalendarEvent
        {
            Id = e.Id,
            Summary = e.Summary ?? string.Empty,
            Description = e.Description ?? string.Empty,
            Start = e.Start.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            End = e.End.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            Location = e.Location ?? string.Empty,
            IsAllDay = e.Start.DateTimeDateTimeOffset == null,
            ColorId = e.ColorId ?? string.Empty
        }).ToList() ?? new List<GoogleCalendarEvent>();

        return new EventsResponse
        {
            Events = calendarEvents,
            NextPageToken = events.NextPageToken ?? string.Empty
        };
    }

    public async Task<GoogleCalendarEvent> CreateEventAsync(string calendarId, CreateEventRequest request, string accessToken)
    {
        var service = CreateCalendarService(accessToken);
        
        var calendarEvent = new Event
        {
            Summary = request.Summary,
            Description = request.Description,
            Location = request.Location,
            ColorId = request.ColorId
        };

        if (request.IsAllDay)
        {
            calendarEvent.Start = new EventDateTime { Date = request.Start.Date.ToString("yyyy-MM-dd") };
            calendarEvent.End = new EventDateTime { Date = request.End.Date.ToString("yyyy-MM-dd") };
        }
        else
        {
            calendarEvent.Start = new EventDateTime { DateTimeDateTimeOffset = request.Start };
            calendarEvent.End = new EventDateTime { DateTimeDateTimeOffset = request.End };
        }

        var createdEvent = await service.Events.Insert(calendarEvent, calendarId).ExecuteAsync();

        return new GoogleCalendarEvent
        {
            Id = createdEvent.Id,
            Summary = createdEvent.Summary ?? string.Empty,
            Description = createdEvent.Description ?? string.Empty,
            Start = createdEvent.Start.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            End = createdEvent.End.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            Location = createdEvent.Location ?? string.Empty,
            IsAllDay = createdEvent.Start.DateTimeDateTimeOffset == null,
            ColorId = createdEvent.ColorId ?? string.Empty
        };
    }

    public async Task<GoogleCalendarEvent> UpdateEventAsync(string calendarId, UpdateEventRequest request, string accessToken)
    {
        var service = CreateCalendarService(accessToken);
        
        var calendarEvent = new Event
        {
            Summary = request.Summary,
            Description = request.Description,
            Location = request.Location,
            ColorId = request.ColorId
        };

        if (request.IsAllDay)
        {
            calendarEvent.Start = new EventDateTime { Date = request.Start.Date.ToString("yyyy-MM-dd") };
            calendarEvent.End = new EventDateTime { Date = request.End.Date.ToString("yyyy-MM-dd") };
        }
        else
        {
            calendarEvent.Start = new EventDateTime { DateTimeDateTimeOffset = request.Start };
            calendarEvent.End = new EventDateTime { DateTimeDateTimeOffset = request.End };
        }

        var updatedEvent = await service.Events.Update(calendarEvent, calendarId, request.Id).ExecuteAsync();

        return new GoogleCalendarEvent
        {
            Id = updatedEvent.Id,
            Summary = updatedEvent.Summary ?? string.Empty,
            Description = updatedEvent.Description ?? string.Empty,
            Start = updatedEvent.Start.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            End = updatedEvent.End.DateTimeDateTimeOffset?.UtcDateTime ?? DateTime.MinValue,
            Location = updatedEvent.Location ?? string.Empty,
            IsAllDay = updatedEvent.Start.DateTimeDateTimeOffset == null,
            ColorId = updatedEvent.ColorId ?? string.Empty
        };
    }

    public async Task DeleteEventAsync(string calendarId, string eventId, string accessToken)
    {
        var service = CreateCalendarService(accessToken);
        await service.Events.Delete(calendarId, eventId).ExecuteAsync();
    }
} 