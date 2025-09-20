# Book Search Functionality

This document explains how the book search functionality works in the Personal Tracker app.

## Features

### 1. Book Search
- Search for books using the backend API
- Results are displayed in a horizontal carousel
- Tap on a book to add it to your "Want to Read" list
- Long press to remove books from the list

### 2. Local Storage
- Books are stored locally using AsyncStorage
- Reading progress is tracked and saved locally
- Data persists between app sessions

### 3. Backend Integration
- Uses the .NET backend API for book searches
- Falls back to mock data if backend is unavailable
- Supports Google Books API integration (optional)

## Setup

### Backend Configuration

1. **Start the .NET Backend:**
   ```bash
   cd PersonalTrackerBackend
   dotnet run
   ```
   The backend will run on `http://localhost:5223`

2. **Optional: Google Books API Integration**
   - Get a Google Books API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add the API key to `appsettings.json`:
   ```json
   {
     "GoogleBooks": {
       "ApiKey": "YOUR_API_KEY_HERE"
     }
   }
   ```

### React Native App

1. **Install Dependencies:**
   ```bash
   cd PersonalTrackerNative
   npm install @react-native-async-storage/async-storage
   ```

2. **Start the App:**
   ```bash
   npx expo start
   ```

## API Endpoints

### Search Books
- **URL:** `POST /api/book/search-books`
- **Request Body:**
  ```json
  {
    "query": "atomic habits"
  }
  ```
- **Response:**
  ```json
  {
    "books": [
      {
        "id": "1",
        "title": "Atomic Habits",
        "author": "James Clear",
        "pages": 320,
        "coverUrl": null,
        "description": "Tiny changes, remarkable results"
      }
    ]
  }
  ```

## Local Storage Keys

The app uses the following AsyncStorage keys:
- `want_to_read_books` - List of books in "Want to Read" list
- `current_books` - Currently reading books
- `reading_progress` - Reading progress for each book

## Usage

1. **Navigate to Knowledge Tab**
   - Tap on the "Knowledge" tab in the bottom navigation

2. **Search for Books**
   - Tap the "+" button in the "Want to Read" section
   - Enter a book title or author name
   - Tap "Search" to find books

3. **Add Books to List**
   - Tap on any search result to add it to your "Want to Read" list
   - The book will appear in the horizontal carousel

4. **Manage Your List**
   - Tap on a book in your list to see options (Start Reading, Remove)
   - Long press to quickly remove a book

5. **Track Progress**
   - Reading progress is automatically saved locally
   - Progress persists between app sessions

## Error Handling

- If the backend is unavailable, the app falls back to mock data
- Network errors are handled gracefully with user-friendly messages
- Local storage errors are logged but don't crash the app

## Future Enhancements

- [ ] Add "Currently Reading" list management
- [ ] Implement reading progress tracking with page counts
- [ ] Add book completion tracking
- [ ] Integrate with reading streak calculations
- [ ] Add book recommendations based on reading history 