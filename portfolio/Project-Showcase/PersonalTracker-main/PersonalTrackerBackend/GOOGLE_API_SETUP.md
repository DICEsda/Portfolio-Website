# Google API Setup Guide

This guide will help you set up all the Google APIs needed for the Personal Tracker app.

## Required Google APIs

1. **Google Calendar API** - For calendar integration
2. **Google Books API** - For book search functionality

## Step-by-Step Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" > "New Project"
3. Enter project name: `PersonalTracker`
4. Click "Create"

### 2. Enable Required APIs

1. In your project, go to **"APIs & Services" > "Library"**
2. Search for and enable these APIs:
   - **Google Calendar API**
   - **Google Books API**

### 3. Create OAuth 2.0 Credentials (for Calendar)

1. Go to **"APIs & Services" > "Credentials"**
2. Click **"Create Credentials" > "OAuth 2.0 Client IDs"**
3. Choose **"Web application"**
4. Add these Authorized redirect URIs:
   - `http://localhost:5173/auth/callback` (for React app)
   - `http://localhost:3000/auth/callback` (alternative React port)
5. Click "Create"
6. **Save the Client ID and Client Secret**

### 4. Create API Key (for Books)

1. In the same Credentials page
2. Click **"Create Credentials" > "API Key"**
3. **Save the API Key**

### 5. Configure Your App

Update your `appsettings.json` with the real credentials:

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "GoogleCalendar": {
    "ClientId": "YOUR_OAUTH_CLIENT_ID_HERE",
    "ClientSecret": "YOUR_OAUTH_CLIENT_SECRET_HERE",
    "ApplicationName": "PersonalTracker"
  },
  "GoogleBooks": {
    "ApiKey": "YOUR_API_KEY_HERE"
  }
}
```

### 6. Security Best Practices

#### For Development (appsettings.Development.json)
Create a separate file for development credentials:

```json
{
  "GoogleCalendar": {
    "ClientId": "your-dev-client-id",
    "ClientSecret": "your-dev-client-secret",
    "ApplicationName": "PersonalTracker"
  },
  "GoogleBooks": {
    "ApiKey": "your-dev-api-key"
  }
}
```

**Important:** Add `appsettings.Development.json` to your `.gitignore` file!

#### For Production
Use environment variables or Azure Key Vault:

```bash
# Environment variables
GOOGLECALENDAR__CLIENTID=your-client-id
GOOGLECALENDAR__CLIENTSECRET=your-client-secret
GOOGLEBOOKS__APIKEY=your-api-key
```

### 7. API Quotas and Limits

#### Google Calendar API
- **Queries per day:** 1,000,000,000
- **Queries per 100 seconds per user:** 1,000
- **Queries per 100 seconds:** 10,000

#### Google Books API
- **Queries per day:** 1,000 (free tier)
- **Queries per 100 seconds per user:** 100

### 8. Testing Your Setup

#### Test Calendar API
```bash
curl -X GET "http://localhost:5223/api/googlecalendar/calendars" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

#### Test Books API
```bash
curl -X POST "http://localhost:5223/api/book/search-books" \
  -H "Content-Type: application/json" \
  -d '{"query": "atomic habits"}'
```

### 9. Troubleshooting

#### Common Issues:

1. **"API not enabled" error**
   - Make sure you've enabled the APIs in step 2

2. **"Invalid credentials" error**
   - Check that your Client ID and Client Secret are correct
   - Ensure redirect URIs match your app

3. **"Quota exceeded" error**
   - Check your API usage in Google Cloud Console
   - Consider upgrading to a paid plan

4. **CORS errors**
   - Make sure your backend CORS settings include your frontend URLs

### 10. Monitoring

1. Go to **"APIs & Services" > "Dashboard"**
2. Monitor API usage and errors
3. Set up alerts for quota limits

## Next Steps

After setting up the APIs:

1. **Test the Calendar Integration** in your React app
2. **Test the Book Search** in your React Native app
3. **Monitor API usage** to ensure you stay within limits
4. **Set up proper error handling** for API failures

## Support

- [Google Calendar API Documentation](https://developers.google.com/calendar)
- [Google Books API Documentation](https://developers.google.com/books)
- [Google Cloud Console](https://console.cloud.google.com/) 