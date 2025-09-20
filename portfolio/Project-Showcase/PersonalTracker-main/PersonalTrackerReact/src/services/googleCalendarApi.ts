import axios from 'axios';
import type {
  GoogleCalendarEvent,
  CreateEventRequest,
  UpdateEventRequest,
  CalendarListResponse,
  EventsResponse,
  GoogleAuthResponse
} from '../types/googleCalendar';

const API_BASE_URL = 'http://localhost:5000/api';

// Google OAuth configuration
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
const GOOGLE_SCOPES = ['https://www.googleapis.com/auth/calendar'];

class GoogleCalendarApi {
  private accessToken: string | null = null;

  setAccessToken(token: string) {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Google OAuth methods
  async authenticate(): Promise<string> {
    return new Promise((resolve, reject) => {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(window.location.origin + '/auth/callback')}&` +
        `scope=${encodeURIComponent(GOOGLE_SCOPES.join(' '))}&` +
        `response_type=token&`;

      const authWindow = window.open(authUrl, 'google-auth', 'width=500,height=600');
      
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          this.accessToken = event.data.accessToken;
          window.removeEventListener('message', handleMessage);
          if (authWindow) authWindow.close();
          resolve(event.data.accessToken);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          if (authWindow) authWindow.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', handleMessage);
    });
  }

  private getAuthHeaders() {
    if (!this.accessToken) {
      throw new Error('No access token available. Please authenticate first.');
    }
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json'
    };
  }

  // Calendar API methods
  async getCalendars(): Promise<CalendarListResponse> {
    const response = await axios.get(`${API_BASE_URL}/GoogleCalendar/calendars`, {
      headers: this.getAuthHeaders()
    });
    return response.data;
  }

  async getEvents(
    calendarId: string,
    startDate?: Date,
    endDate?: Date,
    pageToken?: string
  ): Promise<EventsResponse> {
    const params: any = {};
    if (startDate) params.startDate = startDate.toISOString();
    if (endDate) params.endDate = endDate.toISOString();
    if (pageToken) params.pageToken = pageToken;

    const response = await axios.get(`${API_BASE_URL}/GoogleCalendar/calendars/${calendarId}/events`, {
      headers: this.getAuthHeaders(),
      params
    });
    return response.data;
  }

  async createEvent(calendarId: string, event: CreateEventRequest): Promise<GoogleCalendarEvent> {
    const response = await axios.post(
      `${API_BASE_URL}/GoogleCalendar/calendars/${calendarId}/events`,
      event,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async updateEvent(calendarId: string, eventId: string, event: UpdateEventRequest): Promise<GoogleCalendarEvent> {
    const response = await axios.put(
      `${API_BASE_URL}/GoogleCalendar/calendars/${calendarId}/events/${eventId}`,
      event,
      { headers: this.getAuthHeaders() }
    );
    return response.data;
  }

  async deleteEvent(calendarId: string, eventId: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/GoogleCalendar/calendars/${calendarId}/events/${eventId}`,
      { headers: this.getAuthHeaders() }
    );
  }
}

export const googleCalendarApi = new GoogleCalendarApi(); 