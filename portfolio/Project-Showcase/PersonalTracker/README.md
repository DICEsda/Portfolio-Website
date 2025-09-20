# Personal Tracker with Google Calendar Integration

A comprehensive personal tracking application with Google Calendar integration for managing events and schedules.

## Features

- **Dashboard**: Overview of all personal metrics
- **Fitness Tracking**: Steps, calories, active minutes, workouts
- **Financial Tracking**: Net worth, investments, savings, expenses
- **Mindfulness**: Mood tracking, meditation, journal entries
- **Google Calendar Integration**: View, create, edit, and delete calendar events

## Google Calendar Integration Setup

### 1. Google Cloud Console Setup

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Calendar API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Calendar API"
   - Click on it and press "Enable"

### 2. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application" as the application type
4. Add authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for development)
   - `http://localhost:3000/auth/callback` (alternative dev port)
5. Copy the Client ID and Client Secret

### 3. Backend Configuration

1. Update `PersonalTrackerBackend/appsettings.json`:
```json
{
  "GoogleCalendar": {
    "ClientId": "YOUR_GOOGLE_CLIENT_ID",
    "ClientSecret": "YOUR_GOOGLE_CLIENT_SECRET",
    "ApplicationName": "PersonalTracker"
  }
}
```

### 4. Frontend Configuration

1. Update `PersonalTrackerReact/src/services/googleCalendarApi.ts`:
```typescript
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID';
```

## Installation and Running

### Backend (ASP.NET Core)

```bash
cd PersonalTrackerBackend
dotnet restore
dotnet run
```

The backend will run on `http://localhost:5000`

### Frontend (React)

```bash
cd PersonalTrackerReact
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`

## API Endpoints

### Google Calendar API

- `GET /api/GoogleCalendar/calendars` - Get user's calendars
- `GET /api/GoogleCalendar/calendars/{calendarId}/events` - Get events for a calendar
- `POST /api/GoogleCalendar/calendars/{calendarId}/events` - Create a new event
- `PUT /api/GoogleCalendar/calendars/{calendarId}/events/{eventId}` - Update an event
- `DELETE /api/GoogleCalendar/calendars/{calendarId}/events/{eventId}` - Delete an event

## Usage

1. Start both the backend and frontend applications
2. Navigate to the Calendar section in the app
3. Click "Connect Google Calendar" to authenticate
4. Once authenticated, you can:
   - View your calendar events in a weekly view
   - Create new events with title, description, location, and time
   - Edit existing events
   - Delete events by clicking on them
   - Navigate between weeks

## Security Notes

- Store your Google Client ID and Secret securely
- Never commit these credentials to version control
- Use environment variables in production
- The access token is stored in localStorage for the session

## Technologies Used

- **Backend**: ASP.NET Core 9.0, Google Calendar API
- **Frontend**: React 19, TypeScript, Tailwind CSS, Framer Motion
- **Authentication**: Google OAuth 2.0
- **HTTP Client**: Axios

## Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure the backend CORS policy allows your frontend origin
2. **Authentication Errors**: Verify your Google Client ID and redirect URIs
3. **API Errors**: Check that the Google Calendar API is enabled in your Google Cloud project

### Development Tips

- Use browser developer tools to check for network errors
- Verify the access token is being sent in API requests
- Check the Google Cloud Console for API usage and errors 