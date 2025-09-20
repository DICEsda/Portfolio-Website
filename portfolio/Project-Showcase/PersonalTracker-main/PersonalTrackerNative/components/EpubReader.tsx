import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  ActivityIndicator,
  FlatList,
  Modal as RNModal,
  Animated,
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/components/useColorScheme';
import Colors from '@/constants/Colors';
import EpubParser, { 
  EpubBook, 
  ReadingProgress, 
  Bookmark, 
  ReadingSession,
  ReadingStatistics 
} from '@/services/epubParser';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

interface EpubReaderProps {
  onClose: () => void;
  onProgressUpdate?: (progress: number) => void;
  initialBook?: EpubBook;
}

export default function EpubReader({ onClose, onProgressUpdate, initialBook }: EpubReaderProps) {
  const colorScheme = useColorScheme();
  const C = Colors[colorScheme ?? 'light'];
  const [currentBook, setCurrentBook] = useState<EpubBook | null>(initialBook || null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [progress, setProgress] = useState<ReadingProgress | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  const [library, setLibrary] = useState<EpubBook[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [statistics, setStatistics] = useState<ReadingStatistics | null>(null);
  const [currentSession, setCurrentSession] = useState<ReadingSession | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [resumePrompt, setResumePrompt] = useState<{book: EpubBook, chapter: number} | null>(null);
  const webViewRef = useRef<WebView>(null);
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const overlayTimeout = useRef<number | null>(null);

  // Load library and current book data
  useEffect(() => {
    loadLibrary();
    if (currentBook) {
      loadBookData();
      startReadingSession();
    }
  }, [currentBook]);

  // On mount, check for lastReadBook
  useEffect(() => {
    (async () => {
      const lastRead = await AsyncStorage.getItem('lastReadBook');
      if (lastRead) {
        try {
          const { bookId, chapter } = JSON.parse(lastRead);
          const library = await EpubParser.getLibrary();
          const book = library.find(b => b.id === bookId);
          if (book) {
            setResumePrompt({ book, chapter });
          }
        } catch {}
      }
    })();
  }, []);

  // Save last read book on book/chapter change
  useEffect(() => {
    if (currentBook) {
      AsyncStorage.setItem('lastReadBook', JSON.stringify({ bookId: currentBook.id, chapter: currentChapter }));
    }
  }, [currentBook, currentChapter]);

  const loadLibrary = async () => {
    try {
      const books = await EpubParser.getLibrary();
      setLibrary(books);
    } catch (error) {
      console.error('Error loading library:', error);
    }
  };

  const loadBookData = async () => {
    if (!currentBook) return;
    
    try {
      const savedProgress = await EpubParser.loadReadingProgress(currentBook.id);
      const savedBookmarks = await EpubParser.getBookmarks(currentBook.id);
      
      setProgress(savedProgress);
      setBookmarks(savedBookmarks);
      
      if (savedProgress) {
        setCurrentChapter(savedProgress.currentChapter);
      }
    } catch (error) {
      console.error('Error loading book data:', error);
    }
  };

  const startReadingSession = () => {
    if (!currentBook) return;
    
    const session: ReadingSession = {
      id: Date.now().toString(),
      bookId: currentBook.id,
      startTime: new Date(),
      pagesRead: 0,
      readingTime: 0,
    };
    
    setCurrentSession(session);
  };

  const endReadingSession = async () => {
    if (!currentSession || !currentBook) return;
    
    const endTime = new Date();
    const readingTime = (endTime.getTime() - currentSession.startTime.getTime()) / (1000 * 60); // minutes
    
    const updatedSession: ReadingSession = {
      ...currentSession,
      endTime,
      readingTime,
    };
    
    await EpubParser.saveReadingSession(updatedSession);
    setCurrentSession(null);
  };

  const handleFilePick = async () => {
    try {
      setIsLoading(true);
      
      const book = await EpubParser.parseEpubFile();
      setCurrentBook(book);
      
      Alert.alert(
        'Book Added',
        `"${book.title}" has been added to your library and is ready to read!`,
        [{ text: 'Start Reading' }]
      );
    } catch (error) {
      console.error('Error picking file:', error);
      Alert.alert('Error', 'Failed to open the EPUB file. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Overlay animation
  const showBackOverlay = () => {
    setShowOverlay(true);
    Animated.timing(overlayOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    if (overlayTimeout.current) clearTimeout(overlayTimeout.current);
    overlayTimeout.current = setTimeout(() => {
      Animated.timing(overlayOpacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(() => setShowOverlay(false));
    }, 2500);
  };

  // Handle tap in WebView
  const injectedJS = `
    document.addEventListener('click', function(e) {
      window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'tap' }));
    });
    true;
  `;

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'tap') {
        showBackOverlay();
      } else if (data.type === 'progress') {
        // Optionally handle progress
      } else if (data.type === 'chapterChange') {
        setCurrentChapter(data.chapter);
      }
    } catch {}
  };

  const handleResume = () => {
    if (resumePrompt) {
      setCurrentBook(resumePrompt.book);
      setCurrentChapter(resumePrompt.chapter);
      setResumePrompt(null);
    }
  };

  const loadStatistics = async () => {
    try {
      const stats = await EpubParser.getReadingStatistics();
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  };

  const renderLibraryItem = ({ item }: { item: EpubBook }) => (
    <TouchableOpacity 
      style={[styles.libraryItem, { backgroundColor: C.card }]}
      onPress={() => {
        setCurrentBook(item);
        setShowLibrary(false);
      }}
    >
      <View style={[styles.bookCover, { backgroundColor: getBookCoverColor(item.title) }]}>
        <Text style={styles.bookCoverText}>
          {item.title.split(' ').map((word: string) => word[0]).join('').toUpperCase()}
        </Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={[styles.bookTitle, { color: C.text }]} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={[styles.bookAuthor, { color: C.tabIconDefault }]} numberOfLines={1}>
          {item.author}
        </Text>
        <Text style={[styles.bookDate, { color: C.tabIconDefault }]}>
          Added {new Date(item.addedDate).toLocaleDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderBookmarkItem = ({ item }: { item: Bookmark }) => (
    <TouchableOpacity 
      style={[styles.bookmarkItem, { backgroundColor: C.card }]}
      onPress={() => {
        setCurrentChapter(item.pageNumber - 1);
        setShowBookmarks(false);
      }}
    >
      <View style={styles.bookmarkContent}>
        <Text style={[styles.bookmarkText, { color: C.text }]} numberOfLines={2}>
          {item.text}
        </Text>
        <Text style={[styles.bookmarkDate, { color: C.tabIconDefault }]}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBookmark}
        onPress={async () => {
          await EpubParser.removeBookmark(item.bookId, item.id);
          setBookmarks(prev => prev.filter(b => b.id !== item.id));
        }}
      >
        <Text style={[styles.removeBookmarkText, { color: C.text }]}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getBookCoverColor = (title: string) => {
    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#06B6D4', '#8B5A2B', '#EC4899'];
    const index = title.length % colors.length;
    return colors[index];
  };

  const generateReaderHTML = () => {
    if (!currentBook) return '';
    return EpubParser.generateReaderHTML(currentBook, currentChapter, colorScheme as 'light' | 'dark');
  };

  if (resumePrompt) {
    return (
      <View style={styles.resumeContainer}>
        <Text style={styles.resumeText}>Resume "{resumePrompt.book.title}"?</Text>
        <TouchableOpacity style={styles.resumeButton} onPress={handleResume}>
          <Text style={styles.resumeButtonText}>Resume</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resumeButtonSecondary} onPress={() => setResumePrompt(null)}>
          <Text style={styles.resumeButtonTextSecondary}>No, start fresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: C.background }]}>
      {/* Hide Status Bar for immersive reading experience */}
      <StatusBar hidden={true} />
      
      {/* Header */}
      <View style={[styles.header, { backgroundColor: C.card }]}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeButtonText, { color: C.text }]}>✕</Text>
        </TouchableOpacity>
        
        <Text style={[styles.title, { color: C.text }]} numberOfLines={1}>
          {currentBook ? currentBook.title : 'Personal Reader'}
        </Text>
        
        <View style={styles.headerButtons}>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowBookmarks(true)}
          >
            <Text style={[styles.headerButtonText, { color: C.text }]}>🔖</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => setShowLibrary(true)}
          >
            <Text style={[styles.headerButtonText, { color: C.text }]}>📚</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.headerButton}
            onPress={() => {
              setShowStats(true);
              loadStatistics();
            }}
          >
            <Text style={[styles.headerButtonText, { color: C.text }]}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={[styles.progressBar, { backgroundColor: C.border }]}>
        <View 
          style={[
            styles.progressFill, 
            { 
              width: `${progress?.progress || 0}%`,
              backgroundColor: C.accent 
            }
          ]} 
        />
      </View>

      {/* Reader Content */}
      <View style={styles.readerContainer}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={C.accent} />
            <Text style={[styles.loadingText, { color: C.text }]}>
              Loading book...
            </Text>
          </View>
        ) : currentBook ? (
          <>
            <WebView
              ref={webViewRef}
              source={{ html: generateReaderHTML() }}
              style={styles.webview}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              injectedJavaScript={injectedJS}
              startInLoadingState={false}
              scalesPageToFit={false}
              scrollEnabled={true}
              bounces={false}
            />
            {showOverlay && (
              <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]}> 
                <TouchableOpacity style={styles.backButton} onPress={onClose}>
                  <Text style={styles.backButtonText}>← Back to My Books</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </>
        ) : (
          <View style={styles.welcomeContainer}>
            <Text style={[styles.welcomeTitle, { color: C.text }]}>
              Welcome to Your Personal Reader
            </Text>
            <Text style={[styles.welcomeText, { color: C.tabIconDefault }]}>
              Start by adding a book to your library
            </Text>
            <TouchableOpacity 
              style={[styles.addBookButton, { backgroundColor: C.accent }]}
              onPress={handleFilePick}
            >
              <Text style={[styles.addBookButtonText, { color: C.background }]}>
                📖 Add Book
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Library Modal */}
      <RNModal
        visible={showLibrary}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: C.card }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>Library</Text>
            <TouchableOpacity onPress={() => setShowLibrary(false)}>
              <Text style={[styles.modalClose, { color: C.text }]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={library}
            renderItem={renderLibraryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.libraryList}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: C.tabIconDefault }]}>
                  No books in your library yet.
                </Text>
                <TouchableOpacity 
                  style={[styles.addBookButton, { backgroundColor: C.accent }]}
                  onPress={() => {
                    setShowLibrary(false);
                    handleFilePick();
                  }}
                >
                  <Text style={[styles.addBookButtonText, { color: C.background }]}>
                    Add Your First Book
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      </RNModal>

      {/* Bookmarks Modal */}
      <RNModal
        visible={showBookmarks}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: C.card }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>Bookmarks</Text>
            <TouchableOpacity onPress={() => setShowBookmarks(false)}>
              <Text style={[styles.modalClose, { color: C.text }]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={bookmarks}
            renderItem={renderBookmarkItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.bookmarksList}
            ListEmptyComponent={() => (
              <View style={styles.emptyState}>
                <Text style={[styles.emptyStateText, { color: C.tabIconDefault }]}>
                  No bookmarks yet.
                </Text>
              </View>
            )}
          />
        </View>
      </RNModal>

      {/* Statistics Modal */}
      <RNModal
        visible={showStats}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={[styles.modalContainer, { backgroundColor: C.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: C.card }]}>
            <Text style={[styles.modalTitle, { color: C.text }]}>Reading Statistics</Text>
            <TouchableOpacity onPress={() => setShowStats(false)}>
              <Text style={[styles.modalClose, { color: C.text }]}>Done</Text>
            </TouchableOpacity>
          </View>
          
          {statistics && (
            <View style={styles.statsContainer}>
              <View style={[styles.statCard, { backgroundColor: C.card }]}>
                <Text style={[styles.statNumber, { color: C.accent }]}>
                  {statistics.totalBooksRead}
                </Text>
                <Text style={[styles.statLabel, { color: C.text }]}>Books Read</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: C.card }]}>
                <Text style={[styles.statNumber, { color: C.accent }]}>
                  {statistics.totalPagesRead}
                </Text>
                <Text style={[styles.statLabel, { color: C.text }]}>Pages Read</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: C.card }]}>
                <Text style={[styles.statNumber, { color: C.accent }]}>
                  {Math.round(statistics.totalReadingTime)}
                </Text>
                <Text style={[styles.statLabel, { color: C.text }]}>Hours Read</Text>
              </View>
              
              <View style={[styles.statCard, { backgroundColor: C.card }]}>
                <Text style={[styles.statNumber, { color: C.accent }]}>
                  {statistics.readingStreak}
                </Text>
                <Text style={[styles.statLabel, { color: C.text }]}>Day Streak</Text>
              </View>
            </View>
          )}
        </View>
      </RNModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerButtonText: {
    fontSize: 18,
  },
  progressBar: {
    height: 4,
    width: '100%',
  },
  progressFill: {
    height: '100%',
  },
  readerContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  addBookButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  addBookButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalClose: {
    fontSize: 16,
    fontWeight: '600',
  },
  libraryList: {
    padding: 20,
  },
  libraryItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
  },
  bookCover: {
    width: 60,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  bookCoverText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    marginBottom: 4,
  },
  bookDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  bookmarksList: {
    padding: 20,
  },
  bookmarkItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
  },
  bookmarkContent: {
    flex: 1,
  },
  bookmarkText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  bookmarkDate: {
    fontSize: 12,
    opacity: 0.7,
  },
  removeBookmark: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBookmarkText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 15,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 10,
    paddingLeft: 20,
  },
  backButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    backgroundColor: '#222',
    borderRadius: 20,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  resumeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  resumeText: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 24,
    textAlign: 'center',
  },
  resumeButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  resumeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resumeButtonSecondary: {
    backgroundColor: '#333',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 20,
  },
  resumeButtonTextSecondary: {
    color: '#fff',
    fontSize: 16,
  },
}); 