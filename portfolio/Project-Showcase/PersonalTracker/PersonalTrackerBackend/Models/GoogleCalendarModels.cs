namespace PersonalTrackerBackend.Models;

public class GoogleCalendarEvent
{
    public string Id { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Location { get; set; } = string.Empty;
    public bool IsAllDay { get; set; }
    public string ColorId { get; set; } = string.Empty;
}

public class CreateEventRequest
{
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime Start { get; set; }
    public DateTime End { get; set; }
    public string Location { get; set; } = string.Empty;
    public bool IsAllDay { get; set; }
    public string ColorId { get; set; } = string.Empty;
}

public class UpdateEventRequest : CreateEventRequest
{
    public string Id { get; set; } = string.Empty;
}

public class CalendarListResponse
{
    public List<CalendarInfo> Calendars { get; set; } = new();
}

public class CalendarInfo
{
    public string Id { get; set; } = string.Empty;
    public string Summary { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool Primary { get; set; }
    public string AccessRole { get; set; } = string.Empty;
}

public class EventsResponse
{
    public List<GoogleCalendarEvent> Events { get; set; } = new();
    public string NextPageToken { get; set; } = string.Empty;
} 