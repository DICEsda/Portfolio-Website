# Apple Books-like EPUB Reader

A comprehensive EPUB reader that mimics Apple Books functionality, built for React Native with Expo.

## 🎯 Features

### 📚 **Library Management**
- **Add EPUB files** to your personal library
- **Automatic metadata extraction** (title, author, publisher, description)
- **Cover image support** (when available)
- **Library organization** with add dates and last read tracking
- **Remove books** from library

### 📖 **Reading Experience**
- **Full EPUB parsing** with proper chapter extraction
- **Table of contents** navigation
- **Chapter-by-chapter reading** with smooth transitions
- **Progress tracking** with visual progress bar
- **Reading position memory** - resume where you left off
- **Beautiful typography** with Apple-style fonts and spacing

### 🔖 **Bookmarks & Navigation**
- **Add bookmarks** with one tap
- **Bookmark management** with notes and colors
- **Quick navigation** to bookmarked sections
- **Chapter navigation** with previous/next controls
- **Page-by-page scrolling** for precise reading

### 📊 **Reading Statistics**
- **Reading sessions** tracking (start/end times, duration)
- **Reading speed** calculation (pages per minute)
- **Total reading time** across all books
- **Reading streaks** (consecutive days)
- **Progress analytics** with visual charts
- **Reading goals** and achievements

### 🎨 **Customization**
- **Dark/Light mode** support
- **Font size adjustment** (5 different sizes)
- **Theme switching** on the fly
- **Responsive design** for all screen sizes
- **Apple-style UI** with smooth animations

### 💾 **Data Persistence**
- **Local storage** for all reading data
- **Automatic progress saving**
- **Bookmark persistence**
- **Reading session history**
- **Library backup** (can be extended to cloud)

## 🚀 Getting Started

### 1. **Install Dependencies**
```bash
npm install jszip xml2js react-native-webview expo-document-picker expo-file-system @react-native-async-storage/async-storage
```

### 2. **Add EPUB Files**
1. Open the Knowledge tab in your app
2. Tap the "📖 Read Now" button
3. Tap "📖 Add Book" to select an EPUB file
4. The book will be parsed and added to your library

### 3. **Start Reading**
1. Select a book from your library
2. Use the reading controls at the bottom:
   - **◀ ▶** - Navigate between chapters
   - **← →** - Scroll through pages
   - **Aa** - Adjust font size
   - **🌙** - Toggle dark/light mode

## 📱 User Interface

### **Main Reader Screen**
- **Header**: Book title, close button, and action buttons
- **Progress Bar**: Visual reading progress
- **Reading Area**: Clean, distraction-free reading interface
- **Controls**: Floating control panel at bottom

### **Action Buttons**
- **🔖 Bookmarks**: View and manage bookmarks
- **📚 Library**: Browse your book collection
- **📊 Statistics**: View reading analytics

### **Modals**
- **Library Modal**: Browse all your books
- **Bookmarks Modal**: Manage bookmarks for current book
- **Statistics Modal**: View reading statistics

## 🔧 Technical Implementation

### **EPUB Parsing**
```typescript
// Parse EPUB file structure
const book = await EpubParser.parseEpubFile();

// Extract metadata
const { title, author, chapters, tableOfContents } = book;

// Generate reading HTML
const html = EpubParser.generateReaderHTML(book, currentChapter, theme);
```

### **Progress Tracking**
```typescript
// Save reading progress
const progress: ReadingProgress = {
  bookId: book.id,
  currentChapter: 2,
  currentPage: 45,
  progress: 65.5,
  lastRead: new Date(),
  readingTime: 120, // minutes
  averageReadingSpeed: 2.3 // pages per minute
};

await EpubParser.saveReadingProgress(progress);
```

### **Reading Sessions**
```typescript
// Start reading session
const session: ReadingSession = {
  id: Date.now().toString(),
  bookId: book.id,
  startTime: new Date(),
  pagesRead: 0,
  readingTime: 0
};

// End session with analytics
const endTime = new Date();
const readingTime = (endTime.getTime() - session.startTime.getTime()) / (1000 * 60);
```

## 📊 Data Models

### **EpubBook**
```typescript
interface EpubBook {
  id: string;
  title: string;
  author: string;
  publisher?: string;
  language?: string;
  description?: string;
  coverImage?: string;
  chapters: EpubChapter[];
  tableOfContents: TocItem[];
  totalPages: number;
  filePath: string;
  addedDate: Date;
  lastRead?: Date;
}
```

### **ReadingProgress**
```typescript
interface ReadingProgress {
  bookId: string;
  currentChapter: number;
  currentPage: number;
  progress: number;
  lastRead: Date;
  readingTime: number;
  averageReadingSpeed: number;
}
```

### **Bookmark**
```typescript
interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  pageNumber: number;
  text: string;
  note?: string;
  createdAt: Date;
  color?: string;
}
```

## 🎨 Styling & Theming

### **Reader Interface**
- **Typography**: Apple system fonts with optimal line height
- **Spacing**: Generous margins and padding for readability
- **Colors**: Adaptive to light/dark mode
- **Animations**: Smooth transitions and micro-interactions

### **Dark Mode Support**
```css
body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
```

## 📈 Reading Analytics

### **Statistics Tracked**
- **Total books read**
- **Total pages read**
- **Total reading time** (hours)
- **Average reading speed** (pages per minute)
- **Reading streak** (consecutive days)
- **Reading goals** progress

### **Session Analytics**
- **Reading duration** per session
- **Pages read** per session
- **Reading speed** trends
- **Most active reading times**

## 🔮 Future Enhancements

### **Planned Features**
- [ ] **Cloud sync** for library and progress
- [ ] **Reading goals** with notifications
- [ ] **Social features** (reading groups, recommendations)
- [ ] **Advanced bookmarks** with highlights and notes
- [ ] **Reading speed training** exercises
- [ ] **Export reading data** (CSV, PDF reports)
- [ ] **Audiobook integration** (text-to-speech)
- [ ] **Reading challenges** and achievements

### **Technical Improvements**
- [ ] **Better EPUB parsing** for complex files
- [ ] **Image support** in EPUB content
- [ ] **Custom fonts** support
- [ ] **Reading position sync** across devices
- [ ] **Offline reading** with cached content

## 🐛 Troubleshooting

### **Common Issues**

1. **EPUB file not loading**
   - Ensure file is a valid EPUB format
   - Check file size (should be under 100MB)
   - Try a different EPUB file

2. **Progress not saving**
   - Check AsyncStorage permissions
   - Restart the app
   - Clear app data if needed

3. **Reading interface issues**
   - Update to latest version
   - Check device compatibility
   - Clear WebView cache

### **Performance Tips**
- **Large EPUB files**: Consider splitting into smaller files
- **Memory usage**: Close other apps while reading
- **Battery optimization**: Use dark mode for OLED screens

## 📚 Supported EPUB Features

### **Fully Supported**
- ✅ **EPUB 2.0 and 3.0** formats
- ✅ **Chapter navigation** via table of contents
- ✅ **Metadata extraction** (title, author, etc.)
- ✅ **Text content** with basic formatting
- ✅ **Progress tracking** and bookmarks

### **Partially Supported**
- ⚠️ **Images**: Basic support, may not display correctly
- ⚠️ **Complex formatting**: CSS styles may be simplified
- ⚠️ **Interactive elements**: Limited support

### **Not Supported**
- ❌ **DRM-protected** EPUB files
- ❌ **Audio/video** content
- ❌ **JavaScript** in EPUB files
- ❌ **Complex CSS** animations

## 🤝 Contributing

To contribute to the EPUB reader:

1. **Fork the repository**
2. **Create a feature branch**
3. **Implement your changes**
4. **Add tests** for new functionality
5. **Submit a pull request**

### **Development Setup**
```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run tests
npm test

# Build for production
npx expo build
```

## 📄 License

This EPUB reader is part of the Personal Tracker app and follows the same license terms.

---

**Enjoy reading with your Apple Books-like experience! 📚✨** 