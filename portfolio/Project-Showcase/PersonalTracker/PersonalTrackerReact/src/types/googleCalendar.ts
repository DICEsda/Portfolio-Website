export interface GoogleCalendarEvent {
  id: string;
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  isAllDay: boolean;
  colorId: string;
}

export interface CreateEventRequest {
  summary: string;
  description: string;
  start: string;
  end: string;
  location: string;
  isAllDay: boolean;
  colorId: string;
}

export interface UpdateEventRequest extends CreateEventRequest {
  id: string;
}

export interface CalendarInfo {
  id: string;
  summary: string;
  description: string;
  primary: boolean;
  accessRole: string;
}

export interface CalendarListResponse {
  calendars: CalendarInfo[];
}

export interface EventsResponse {
  events: GoogleCalendarEvent[];
  nextPageToken: string;
}

export interface GoogleAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
} 