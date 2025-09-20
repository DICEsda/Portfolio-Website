import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, ScrollView, Text, View, TouchableOpacity, FlatList, Dimensions, TextInput, Alert, Modal } from 'react-native';
import Animated, { FadeIn, SlideInUp, SlideInRight, FadeOut, SlideOutUp } from 'react-native-reanimated';
import { View as ThemedView, Text as ThemedText } from '@/components/Themed';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import Card from '@/components/Card';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EpubReader from '@/components/EpubReader';
import * as FileSystem from 'expo-file-system';
import EpubParser, { EpubBook } from '@/services/epubParser';
import * as DocumentPicker from 'expo-document-picker';

const { width: screenWidth } = Dimensions.get('window');

const BACKEND_URL = 'http://localhost:5223/api'; // .NET backend port

// Mock data for book progress and reading streaks
const mockBookData = {
  currentBook: {
    title: "Atomic Habits",
    author: "James Clear",
    progress: 65,
    pagesRead: 195,
    totalPages: 300,
    currentChapter: "Chapter 8: How to Make a Habit Irresistible"
  },
  readingStreak: {
    currentStreak: 12,
    longestStreak: 28,
    totalBooksRead: 8,
    pagesReadToday: 15
  },
  recentBooks: [
    { 
      id: 1,
      title: "Deep Work", 
      author: "Cal Newport", 
      completed: true,
      progress: 100,
      coverColor: "#3B82F6" // Blue
    },
    { 
      id: 2,
      title: "The Power of Now", 
      author: "Eckhart Tolle", 
      completed: true,
      progress: 100,
      coverColor: "#10B981" // Green
    },
    { 
      id: 3,
      title: "Thinking, Fast and Slow", 
      author: "Daniel Kahneman", 
      completed: false,
      progress: 45,
      coverColor: "#F59E0B" // Yellow
    },
    { 
      id: 4,
      title: "The 7 Habits", 
      author: "Stephen Covey", 
      completed: false,
      progress: 78,
      coverColor: "#8B5CF6" // Purple
    },
    { 
      id: 5,
      title: "Mindset", 
      author: "Carol Dweck", 
      completed: true,
      progress: 100,
      coverColor: "#EF4444" // Red
    }
  ]
};

// Mock data for journaling and AI insights
const mockJournalData = {
  journalEntries: [
    {
      id: 1,
      date: "2024-01-15",
      title: "Reflections on Atomic Habits",
      content: "Today I learned about the importance of making habits obvious and attractive...",
      mood: "focused",
      tags: ["habits", "productivity", "learning"]
    },
    {
      id: 2,
      date: "2024-01-14",
      title: "Morning Routine Insights",
      content: "My new morning routine is working well. I feel more energized...",
      mood: "energized",
      tags: ["routine", "morning", "energy"]
    }
  ],
  aiInsights: [
    {
      type: "pattern",
      title: "Reading Pattern Detected",
      description: "You read most effectively in the morning between 7-9 AM",
      confidence: 85
    },
    {
      type: "recommendation",
      title: "Book Recommendation",
      description: "Based on your interest in habits, consider 'The 7 Habits of Highly Effective People'",
      confidence: 92
    },
    {
      type: "progress",
      title: "Learning Progress",
      description: "You've improved your reading speed by 23% this month",
      confidence: 78
    }
  ]
};

// Local storage keys
const STORAGE_KEYS = {
  WANT_TO_READ: 'want_to_read_books',
  CURRENT_BOOKS: 'current_books',
  READING_PROGRESS: 'reading_progress',
  MY_BOOKS: 'my_books_folder',
};

const BOOKS_DIR = FileSystem.documentDirectory + 'books/';

// Backend API functions
const searchBooks = async (query: string) => {
  try {
    const response = await fetch(`${BACKEND_URL}/search-books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await response.json();
    return data.books || [];
  } catch (error) {
    console.error('Error searching books:', error);
    // Fallback to mock data if backend is not available
    return getMockSearchResults(query);
  }
};

const getMockSearchResults = (query: string) => {
  const mockBooks = [
    {
      id: '1',
      title: 'The Psychology of Money',
      author: 'Morgan Housel',
      pages: 256,
      coverUrl: null,
      description: 'Timeless lessons on wealth, greed, and happiness'
    },
    {
      id: '2',
      title: 'The Almanack of Naval Ravikant',
      author: 'Eric Jorgenson',
      pages: 288,
      coverUrl: null,
      description: 'A guide to wealth and happiness'
    },
    {
      id: '3',
      title: 'Atomic Habits',
      author: 'James Clear',
      pages: 320,
      coverUrl: null,
      description: 'Tiny changes, remarkable results'
    },
    {
      id: '4',
      title: 'Deep Work',
      author: 'Cal Newport',
      pages: 304,
      coverUrl: null,
      description: 'Rules for focused success in a distracted world'
    }
  ];
  
  return mockBooks.filter(book => 
    book.title.toLowerCase().includes(query.toLowerCase()) ||
    book.author.toLowerCase().includes(query.toLowerCase())
  );
};

// Local storage functions
const saveWantToReadBooks = async (books: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.WANT_TO_READ, JSON.stringify(books));
  } catch (error) {
    console.error('Error saving want to read books:', error);
  }
};

const loadWantToReadBooks = async () => {
  try {
    const books = await AsyncStorage.getItem(STORAGE_KEYS.WANT_TO_READ);
    return books ? JSON.parse(books) : [];
  } catch (error) {
    console.error('Error loading want to read books:', error);
    return [];
  }
};

const saveReadingProgress = async (bookId: string, progress: number, pagesRead: number) => {
  try {
    const existingProgress = await AsyncStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    const progressData = existingProgress ? JSON.parse(existingProgress) : {};
    
    progressData[bookId] = {
      progress,
      pagesRead,
      lastUpdated: new Date().toISOString()
    };
    
    await AsyncStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(progressData));
  } catch (error) {
    console.error('Error saving reading progress:', error);
  }
};

const loadReadingProgress = async (bookId: string) => {
  try {
    const existingProgress = await AsyncStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
    const progressData = existingProgress ? JSON.parse(existingProgress) : {};
    return progressData[bookId] || null;
  } catch (error) {
    console.error('Error loading reading progress:', error);
    return null;
  }
};

const addBookToWantToRead = async (book: any) => {
  try {
    const existingBooks = await loadWantToReadBooks();
    const newBook = {
      ...book,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    // Check if book already exists
    const exists = existingBooks.find((b: any) => 
      b.title.toLowerCase() === book.title.toLowerCase() &&
      b.author.toLowerCase() === book.author.toLowerCase()
    );
    
    if (exists) {
      Alert.alert('Book Already Added', 'This book is already in your want to read list.');
      return false;
    }
    
    const updatedBooks = [...existingBooks, newBook];
    await saveWantToReadBooks(updatedBooks);
    return true;
  } catch (error) {
    console.error('Error adding book to want to read:', error);
    return false;
  }
};

const removeBookFromWantToRead = async (bookId: string) => {
  try {
    const existingBooks = await loadWantToReadBooks();
    const updatedBooks = existingBooks.filter((book: any) => book.id !== bookId);
    await saveWantToReadBooks(updatedBooks);
    return true;
  } catch (error) {
    console.error('Error removing book from want to read:', error);
    return false;
  }
};

const saveMyBooks = async (books: any[]) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.MY_BOOKS, JSON.stringify(books));
    return true;
  } catch (error) {
    console.error('Error saving My Books:', error);
    return false;
  }
};

const loadMyBooks = async () => {
  try {
    const books = await AsyncStorage.getItem(STORAGE_KEYS.MY_BOOKS);
    return books ? JSON.parse(books) : [];
  } catch (error) {
    console.error('Error loading My Books:', error);
    return [];
  }
};

const addBookToMyBooks = async (book: any) => {
  try {
    const existingBooks = await loadMyBooks();
    const newBook = {
      ...book,
      id: Date.now().toString(),
      addedDate: new Date().toISOString().split('T')[0]
    };
    
    const updatedBooks = [...existingBooks, newBook];
    await saveMyBooks(updatedBooks);
    return true;
  } catch (error) {
    console.error('Error adding book to My Books:', error);
    return false;
  }
};

const removeBookFromMyBooks = async (bookId: string) => {
  try {
    const existingBooks = await loadMyBooks();
    const updatedBooks = existingBooks.filter((book: any) => book.id !== bookId);
    await saveMyBooks(updatedBooks);
    return true;
  } catch (error) {
    console.error('Error removing book from My Books:', error);
    return false;
  }
};

export default function KnowledgeScreen() {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'light'];
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [wantToReadBooks, setWantToReadBooks] = useState<any[]>([]);
  const [showEpubReader, setShowEpubReader] = useState(false);
  const [myBooks, setMyBooks] = useState<any[]>([]);
  const [selectedBook, setSelectedBook] = useState<any | null>(null);
  const [showReadingProgress, setShowReadingProgress] = useState(false);
  const [localBooks, setLocalBooks] = useState<EpubBook[]>([]);

  // Load want to read books on component mount
  useEffect(() => {
    loadWantToReadBooks().then(setWantToReadBooks);
  }, []);

  // Load My Books on mount
  useEffect(() => {
    loadMyBooks().then(setMyBooks);
  }, []);

  // Scan the books directory for EPUB files and parse minimal metadata
  const scanLocalBooks = async () => {
    try {
      // Ensure the directory exists
      const dirInfo = await FileSystem.getInfoAsync(BOOKS_DIR);
      if (!dirInfo.exists) {
        await FileSystem.makeDirectoryAsync(BOOKS_DIR, { intermediates: true });
        setLocalBooks([]);
        return;
      }
      const files = await FileSystem.readDirectoryAsync(BOOKS_DIR);
      const epubFiles = files.filter(f => f.toLowerCase().endsWith('.epub'));
      // Parse minimal metadata for each EPUB
      const books: EpubBook[] = [];
      for (const file of epubFiles) {
        try {
          const filePath = BOOKS_DIR + file;
          const meta = await (require('@/services/epubParser').extractMetadataFromFile)(filePath);
          books.push({ ...meta, filePath });
        } catch (e) { /* skip unreadable files */ }
      }
      setLocalBooks(books);
    } catch (e) {
      setLocalBooks([]);
    }
  };

  // Scan on mount and when screen is focused
  useEffect(() => { scanLocalBooks(); }, []);

  const renderProgressBar = (progress: number) => (
    <View style={styles.progressContainer}>
      <View style={[styles.progressBar, { backgroundColor: C.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${progress}%`,
              backgroundColor: C.accent 
            }
          ]} 
        />
      </View>
      <Text style={[styles.progressText, { color: C.text }]}>{progress}%</Text>
    </View>
  );

  const renderStreakBadge = (streak: number) => (
    <View style={[styles.streakBadge, { backgroundColor: C.accent }]}>
      <Text style={[styles.streakNumber, { color: C.background }]}>{streak}</Text>
      <Text style={[styles.streakLabel, { color: C.background }]}>days</Text>
    </View>
  );

  const renderBookItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.bookItem}>
      <View style={[styles.bookCover, { backgroundColor: item.coverColor }]}>
        <Text style={styles.bookCoverText}>
          {item.title.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
        </Text>
        {item.completed && (
          <View style={styles.completedBadge}>
            <Text style={styles.completedText}>✓</Text>
          </View>
        )}
      </View>
      <View style={styles.bookInfo}>
        <Text style={[styles.bookItemTitle, { color: C.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookItemAuthor, { color: C.tabIconDefault }]} numberOfLines={1}>
          {item.author}
        </Text>
        {!item.completed && (
          <View style={styles.bookProgressContainer}>
            <View style={[styles.bookProgressBar, { backgroundColor: C.border }]}>
              <View 
                style={[
                  styles.bookProgressFill, 
                  { 
                    width: `${item.progress}%`,
                    backgroundColor: C.accent 
                  }
                ]} 
              />
            </View>
            <Text style={[styles.bookProgressText, { color: C.text }]}>{item.progress}%</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderWantToReadItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.bookItem}
      onPress={() => {
        Alert.alert(
          'Book Options',
          `What would you like to do with "${item.title}"?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Start Reading', 
              onPress: () => {
                Alert.alert('Started Reading', `"${item.title}" has been added to your currently reading list.`);
                // TODO: Add to currently reading list
              }
            },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: async () => {
                const success = await removeBookFromWantToRead(item.id);
                if (success) {
                  setWantToReadBooks(prev => prev.filter(book => book.id !== item.id));
                  Alert.alert('Removed', 'Book removed from your want to read list.');
                }
              }
            }
          ]
        );
      }}
      onLongPress={() => {
        Alert.alert(
          'Remove Book',
          `Remove "${item.title}" from your want to read list?`,
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Remove', 
              style: 'destructive',
              onPress: async () => {
                const success = await removeBookFromWantToRead(item.id);
                if (success) {
                  setWantToReadBooks(prev => prev.filter(book => book.id !== item.id));
                  Alert.alert('Removed', 'Book removed from your want to read list.');
                }
              }
            }
          ]
        );
      }}
    >
      <View style={[styles.bookCover, { backgroundColor: item.coverColor || '#6B7280' }]}>
        <Text style={styles.bookCoverText}>
          {item.title.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
        </Text>
        <View style={styles.wantToReadBadge}>
          <Text style={styles.wantToReadText}>📖</Text>
        </View>
      </View>
      <View style={styles.bookInfo}>
        <Text style={[styles.bookItemTitle, { color: C.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookItemAuthor, { color: C.tabIconDefault }]} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={[styles.addedDate, { color: C.tabIconDefault }]}>
          Added {item.addedDate}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.searchResultItem}
      onPress={async () => {
        const success = await addBookToWantToRead(item);
        if (success) {
          setWantToReadBooks(prev => [...prev, { ...item, id: Date.now().toString(), addedDate: new Date().toISOString().split('T')[0] }]);
          Alert.alert('Added!', `"${item.title}" added to your want to read list.`);
          setSearchQuery('');
          setSearchResults([]);
          setShowSearch(false);
        }
      }}
      onLongPress={async () => {
        // Add to My Books directly
        await addBookToMyBooks(item);
        Alert.alert('Added to My Books', `"${item.title}" added to your library.`);
      }}
    >
      <View style={[styles.searchResultCover, { backgroundColor: getBookCoverColor(item.title) }]}>
        <Text style={styles.searchResultCoverText}>
          {item.title?.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
        </Text>
      </View>
      <View style={styles.searchResultInfo}>
        <Text style={[styles.searchResultTitle, { color: C.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.searchResultAuthor, { color: C.tabIconDefault }]} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={[styles.searchResultPages, { color: C.tabIconDefault }]} numberOfLines={1}>
          {item.pages ? `${item.pages} pages` : 'Pages unknown'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const getBookCoverColor = (title: string) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#8B5A2B', '#EC4899'];
    const index = title.length % colors.length;
    return colors[index];
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults([]);
    
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        Alert.alert('No Results', 'No books found for your search. Try a different query.');
      }
    } catch (error) {
      console.error('Search error:', error);
      Alert.alert('Search Error', 'Failed to search books. Please check your connection and try again.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleImportEpub = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: false,
      });
      if (result.canceled) return;
      const file = result.assets[0];
      if (!file.name.toLowerCase().endsWith('.epub')) {
        Alert.alert('Invalid File', 'Please select an EPUB file.');
        return;
      }
      // Copy to books folder
      const destPath = BOOKS_DIR + file.name;
      await FileSystem.copyAsync({ from: file.uri, to: destPath });
      Alert.alert('Imported', `"${file.name}" has been added to your library.`);
      scanLocalBooks();
    } catch (e) {
      Alert.alert('Import Failed', 'Could not import the EPUB file.');
    }
  };

  const renderBooksSection = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View entering={SlideInUp.duration(800).delay(200)}>
        <Text style={[styles.subtitle, { color: C.text }]}>
          Track your reading progress and books
        </Text>
      </Animated.View>

      {/* Book Progress & Reading Streaks Card */}
      <Animated.View entering={SlideInUp.duration(800).delay(300)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>📚 Reading Progress</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: C.accent }]}>
              <Text style={[styles.addButtonText, { color: C.background }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Current Book */}
          <View style={styles.currentBookSection}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Currently Reading</Text>
            <Text style={[styles.bookTitle, { color: C.text }]}>{mockBookData.currentBook.title}</Text>
            <Text style={[styles.bookAuthor, { color: C.tabIconDefault }]}>{mockBookData.currentBook.author}</Text>
            <Text style={[styles.bookProgress, { color: C.text }]}>
              {mockBookData.currentBook.pagesRead} of {mockBookData.currentBook.totalPages} pages
            </Text>
            {renderProgressBar(mockBookData.currentBook.progress)}
            <Text style={[styles.chapterText, { color: C.tabIconDefault }]}>
              {mockBookData.currentBook.currentChapter}
            </Text>
            
            {/* Read Now Button */}
            <TouchableOpacity 
              style={[styles.readNowButton, { backgroundColor: C.accent }]}
              onPress={() => setShowEpubReader(true)}
            >
              <Text style={[styles.readNowButtonText, { color: C.background }]}>
                📖 Read Now
              </Text>
            </TouchableOpacity>
          </View>

          {/* Reading Streaks */}
          <View style={styles.streakSection}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Reading Streak</Text>
            <View style={styles.streakRow}>
              {renderStreakBadge(mockBookData.readingStreak.currentStreak)}
              <View style={styles.streakStats}>
                <Text style={[styles.streakStat, { color: C.text }]}>
                  Longest: {mockBookData.readingStreak.longestStreak} days
                </Text>
                <Text style={[styles.streakStat, { color: C.text }]}>
                  Books read: {mockBookData.readingStreak.totalBooksRead}
                </Text>
                <Text style={[styles.streakStat, { color: C.text }]}>
                  Today: {mockBookData.readingStreak.pagesReadToday} pages
                </Text>
              </View>
            </View>
          </View>
        </Card>
      </Animated.View>

      {/* My Books Card */}
      <Animated.View entering={SlideInUp.duration(800).delay(200)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>📖 My Books</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: C.accent }]} onPress={handleImportEpub}>
              <Text style={[styles.addButtonText, { color: C.background }]}>Import EPUB</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={localBooks}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => { setSelectedBook(item); setShowReadingProgress(true); }}>
                {renderBookItem({ item })}
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.filePath}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookCarousel}
            ItemSeparatorComponent={() => <View style={styles.bookSeparator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: C.tabIconDefault }]}>No EPUBs found in your library folder.</Text>
                <Text style={[styles.emptyStateSubtext, { color: C.tabIconDefault }]}>Move EPUB files into the app's books folder to see them here.</Text>
              </View>
            )}
          />
        </Card>
      </Animated.View>

      {/* Want to Read Card (API only) */}
      <Animated.View entering={SlideInUp.duration(800).delay(300)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>📚 Want to Read</Text>
          </View>
          <FlatList
            data={wantToReadBooks}
            renderItem={renderWantToReadItem}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.bookCarousel}
            ItemSeparatorComponent={() => <View style={styles.bookSeparator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: C.tabIconDefault }]}>No books in your want to read list yet.</Text>
                <Text style={[styles.emptyStateSubtext, { color: C.tabIconDefault }]}>Add books to your wishlist from the API search.</Text>
              </View>
            )}
          />
        </Card>
      </Animated.View>
    </ScrollView>
  );

  const renderJournalSection = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <Animated.View entering={SlideInUp.duration(800).delay(200)}>
        <Text style={[styles.subtitle, { color: C.text }]}>
          Journal your thoughts and get AI insights
        </Text>
      </Animated.View>

      {/* Journaling & AI Insights Card */}
      <Animated.View entering={SlideInUp.duration(800).delay(300)}>
        <Card style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: C.text }]}>✍️ Journal & Insights</Text>
            <TouchableOpacity style={[styles.addButton, { backgroundColor: C.accent }]}>
              <Text style={[styles.addButtonText, { color: C.background }]}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Journal Entries */}
          <View style={styles.journalSection}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>Recent Entries</Text>
            {mockJournalData.journalEntries.map((entry) => (
              <View key={entry.id} style={[styles.journalEntry, { borderColor: C.border }]}>
                <View style={styles.entryHeader}>
                  <Text style={[styles.entryTitle, { color: C.text }]}>{entry.title}</Text>
                  <Text style={[styles.entryDate, { color: C.tabIconDefault }]}>{entry.date}</Text>
                </View>
                <Text style={[styles.entryContent, { color: C.text }]} numberOfLines={2}>
                  {entry.content}
                </Text>
                <View style={styles.tagContainer}>
                  {entry.tags.map((tag, index) => (
                    <View key={index} style={[styles.tag, { backgroundColor: C.accent }]}>
                      <Text style={[styles.tagText, { color: C.background }]}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>

          {/* AI Insights */}
          <View style={styles.insightsSection}>
            <Text style={[styles.sectionTitle, { color: C.text }]}>AI Insights</Text>
            {mockJournalData.aiInsights.map((insight, index) => (
              <View key={index} style={[styles.insightCard, { borderColor: C.border }]}>
                <View style={styles.insightHeader}>
                  <Text style={[styles.insightTitle, { color: C.text }]}>{insight.title}</Text>
                  <Text style={[styles.insightConfidence, { color: C.accent }]}>
                    {insight.confidence}%
                  </Text>
                </View>
                <Text style={[styles.insightDescription, { color: C.text }]}>
                  {insight.description}
                </Text>
              </View>
            ))}
          </View>
        </Card>
      </Animated.View>
    </ScrollView>
  );

  const sections = [
    { key: 'books', render: renderBooksSection },
    { key: 'journal', render: renderJournalSection }
  ];

  const renderSection = ({ item }: { item: any }) => (
    <View style={styles.sectionContainer}>
      {item.render()}
    </View>
  );

  return (
    <Animated.View 
      entering={FadeIn.duration(600).delay(100)}
      style={[styles.container, { backgroundColor: C.background }]}
    >
      {/* Section Indicator */}
      <View style={styles.indicatorContainer}>
        <TouchableOpacity 
          style={[
            styles.indicator, 
            activeIndex === 0 && { backgroundColor: C.accent }
          ]}
          onPress={() => {
            setActiveIndex(0);
            flatListRef.current?.scrollToIndex({ index: 0, animated: true });
          }}
        >
          <Text style={[
            styles.indicatorText, 
            { color: activeIndex === 0 ? C.background : C.text }
          ]}>
            📚 Books
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.indicator, 
            activeIndex === 1 && { backgroundColor: C.accent }
          ]}
          onPress={() => {
            setActiveIndex(1);
            flatListRef.current?.scrollToIndex({ index: 1, animated: true });
          }}
        >
          <Text style={[
            styles.indicatorText, 
            { color: activeIndex === 1 ? C.background : C.text }
          ]}>
            ✍️ Journal
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={sections}
        renderItem={renderSection}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setActiveIndex(index);
        }}
        getItemLayout={(data, index) => ({
          length: screenWidth,
          offset: screenWidth * index,
          index,
        })}
      />

      {/* EPUB Reader Modal */}
      <Modal
        visible={showEpubReader}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <EpubReader
          onClose={() => setShowEpubReader(false)}
          onProgressUpdate={(progress) => {
            console.log('Reading progress:', progress);
            // TODO: Save progress to local storage
          }}
        />
      </Modal>

      {/* Reading Progress Modal */}
      <Modal
        visible={showReadingProgress && !!selectedBook}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowReadingProgress(false)}
      >
        {selectedBook && (
          <View style={{ flex: 1, backgroundColor: C.background, padding: 24 }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: C.text }}>{selectedBook.title}</Text>
            <Text style={{ fontSize: 16, color: C.tabIconDefault }}>{selectedBook.author}</Text>
            {/* Progress, stats, etc. */}
            <Text style={{ marginTop: 16, color: C.text }}>Progress: {selectedBook.progress || 0}%</Text>
            {/* Continue Reading Button */}
            <TouchableOpacity style={[styles.readNowButton, { backgroundColor: C.accent, marginTop: 24 }]} onPress={() => { setShowReadingProgress(false); setShowEpubReader(true); }}>
              <Text style={[styles.readNowButtonText, { color: C.background }]}>Continue Reading</Text>
            </TouchableOpacity>
            {/* Remove from My Books */}
            <TouchableOpacity style={{ marginTop: 24 }} onPress={() => { removeBookFromMyBooks(selectedBook.id); setShowReadingProgress(false); }}>
              <Text style={{ color: 'red', textAlign: 'center' }}>Remove from My Books</Text>
            </TouchableOpacity>
            {/* Close */}
            <TouchableOpacity style={{ marginTop: 24 }} onPress={() => setShowReadingProgress(false)}>
              <Text style={{ color: C.text, textAlign: 'center' }}>Close</Text>
            </TouchableOpacity>
          </View>
        )}
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  indicatorContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    gap: 12,
  },
  indicator: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: 'oklch(15% 0.02 95)',
  },
  indicatorText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sectionContainer: {
    width: screenWidth,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
    marginBottom: 24,
    marginTop: 8,
  },
  card: {
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  currentBookSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 8,
  },
  bookProgress: {
    fontSize: 14,
    marginBottom: 8,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    fontWeight: '600',
    minWidth: 40,
  },
  chapterText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  readNowButton: {
    marginTop: 16,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  readNowButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  streakSection: {
    marginBottom: 16,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  streakNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  streakLabel: {
    fontSize: 10,
  },
  streakStats: {
    flex: 1,
  },
  streakStat: {
    fontSize: 14,
    marginBottom: 4,
  },
  // Book Carousel Styles
  bookCarousel: {
    paddingHorizontal: 4,
  },
  bookItem: {
    width: 120,
    marginHorizontal: 4,
  },
  bookSeparator: {
    width: 12,
  },
  bookCover: {
    width: 120,
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  bookCoverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  completedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#10B981',
  },
  wantToReadBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  wantToReadText: {
    fontSize: 12,
  },
  bookInfo: {
    flex: 1,
  },
  bookItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
  },
  bookItemAuthor: {
    fontSize: 12,
    marginBottom: 8,
  },
  addedDate: {
    fontSize: 10,
    opacity: 0.7,
  },
  bookProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookProgressBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginRight: 8,
  },
  bookProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  bookProgressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 30,
  },
  // Search Styles
  searchSection: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  searchResultsContainer: {
    marginBottom: 16,
  },
  searchResultsList: {
    paddingHorizontal: 4,
  },
  searchResultItem: {
    width: 120,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  searchResultCover: {
    width: 120,
    height: 160,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchResultCoverText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  searchResultInfo: {
    alignItems: 'center',
  },
  searchResultTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
    textAlign: 'center',
  },
  searchResultAuthor: {
    fontSize: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  searchResultPages: {
    fontSize: 10,
    opacity: 0.7,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  journalSection: {
    marginBottom: 24,
  },
  journalEntry: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  entryDate: {
    fontSize: 12,
  },
  entryContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
  },
  insightsSection: {
    marginBottom: 16,
  },
  insightCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  insightTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  insightConfidence: {
    fontSize: 14,
    fontWeight: '600',
  },
  insightDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
}); 