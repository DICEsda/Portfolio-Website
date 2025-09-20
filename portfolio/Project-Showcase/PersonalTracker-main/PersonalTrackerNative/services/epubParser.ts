import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import JSZip from 'jszip';

export interface EpubBook {
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

export interface EpubChapter {
  id: string;
  title: string;
  content: string;
  pageNumber: number;
  href: string;
  spineIndex: number;
}

export interface TocItem {
  id: string;
  title: string;
  href: string;
  level: number;
  children?: TocItem[];
}

export interface ReadingProgress {
  bookId: string;
  currentChapter: number;
  currentPage: number;
  progress: number;
  lastRead: Date;
  readingTime: number; // in minutes
  averageReadingSpeed: number; // pages per minute
}

export interface Bookmark {
  id: string;
  bookId: string;
  chapterId: string;
  pageNumber: number;
  text: string;
  note?: string;
  createdAt: Date;
  color?: string;
}

export interface ReadingSession {
  id: string;
  bookId: string;
  startTime: Date;
  endTime?: Date;
  pagesRead: number;
  readingTime: number; // in minutes
}

export interface ReadingStatistics {
  totalBooksRead: number;
  totalPagesRead: number;
  totalReadingTime: number; // in hours
  averageReadingSpeed: number; // pages per minute
  readingStreak: number;
  favoriteGenres: string[];
  readingGoals: {
    dailyPages: number;
    weeklyBooks: number;
    monthlyPages: number;
  };
}

class EpubParser {
  private async parseContainerXml(zip: JSZip): Promise<string> {
    const containerXml = await zip.file('META-INF/container.xml')?.async('string');
    if (!containerXml) {
      throw new Error('Container.xml not found in EPUB');
    }

    // More flexible regex patterns to handle different container.xml formats
    let rootfileMatch = containerXml.match(/<rootfile[^>]*href="([^"]*)"[^>]*\/>/);
    if (!rootfileMatch) {
      // Try alternative format with closing tag
      rootfileMatch = containerXml.match(/<rootfile[^>]*href="([^"]*)"[^>]*>.*?<\/rootfile>/);
    }
    if (!rootfileMatch) {
      // Try without quotes
      rootfileMatch = containerXml.match(/<rootfile[^>]*href=([^>\s]+)[^>]*\/>/);
    }
    if (!rootfileMatch) {
      // Try with single quotes
      rootfileMatch = containerXml.match(/<rootfile[^>]*href='([^']*)'[^>]*\/>/);
    }
    if (!rootfileMatch) {
      // Try with full-path attribute (common in some EPUBs)
      rootfileMatch = containerXml.match(/<rootfile[^>]*full-path="([^"]*)"[^>]*\/>/);
    }
    if (!rootfileMatch) {
      // Try full-path with closing tag
      rootfileMatch = containerXml.match(/<rootfile[^>]*full-path="([^"]*)"[^>]*>.*?<\/rootfile>/);
    }
    if (!rootfileMatch) {
      // Try full-path without quotes
      rootfileMatch = containerXml.match(/<rootfile[^>]*full-path=([^>\s]+)[^>]*\/>/);
    }
    
    if (!rootfileMatch) {
      console.error('Container.xml content:', containerXml);
      throw new Error('Rootfile not found in container.xml');
    }

    return rootfileMatch[1];
  }

  private async parseContentOpf(zip: JSZip, opfPath: string): Promise<any> {
    const opfContent = await zip.file(opfPath)?.async('string');
    if (!opfContent) {
      throw new Error('Content.opf not found');
    }

    // More flexible regex-based parsing
    const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]*)<\/dc:title>/);
    const authorMatch = opfContent.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/);
    const publisherMatch = opfContent.match(/<dc:publisher[^>]*>([^<]*)<\/dc:publisher>/);
    const languageMatch = opfContent.match(/<dc:language[^>]*>([^<]*)<\/dc:language>/);
    const descriptionMatch = opfContent.match(/<dc:description[^>]*>([^<]*)<\/dc:description>/);

    // Extract manifest items with more flexible patterns
    const manifestMatches = opfContent.match(/<item[^>]*\/>/g);
    const manifest: any = {};
    
    if (manifestMatches) {
      manifestMatches.forEach(match => {
        const idMatch = match.match(/id="([^"]*)"/);
        const hrefMatch = match.match(/href="([^"]*)"/);
        const mediaTypeMatch = match.match(/media-type="([^"]*)"/);
        
        if (idMatch && hrefMatch && mediaTypeMatch) {
          manifest[idMatch[1]] = {
            href: hrefMatch[1],
            mediaType: mediaTypeMatch[1]
          };
        }
      });
    }

    // Extract spine with more flexible patterns
    const spineMatches = opfContent.match(/<itemref[^>]*\/>/g);
    const spine: string[] = [];
    
    if (spineMatches) {
      spineMatches.forEach(match => {
        const idrefMatch = match.match(/idref="([^"]*)"/);
        if (idrefMatch) {
          spine.push(idrefMatch[1]);
        }
      });
    }

    // Fallback: if no spine found, try to find any HTML files in manifest
    if (spine.length === 0) {
      Object.keys(manifest).forEach(id => {
        const item = manifest[id];
        if (item.mediaType === 'application/xhtml+xml' || 
            item.mediaType === 'text/html' ||
            item.href.endsWith('.html') ||
            item.href.endsWith('.xhtml')) {
          spine.push(id);
        }
      });
    }

    console.log('Parsed manifest:', Object.keys(manifest));
    console.log('Parsed spine:', spine);

    return {
      metadata: {
        title: titleMatch ? titleMatch[1] : 'Unknown Title',
        author: authorMatch ? authorMatch[1] : 'Unknown Author',
        publisher: publisherMatch ? publisherMatch[1] : undefined,
        language: languageMatch ? languageMatch[1] : undefined,
        description: descriptionMatch ? descriptionMatch[1] : undefined,
      },
      manifest,
      spine
    };
  }

  private async parseNcx(zip: JSZip, ncxPath: string): Promise<TocItem[]> {
    const ncxContent = await zip.file(ncxPath)?.async('string');
    if (!ncxContent) return [];

    // Simple regex-based parsing for navigation
    const navPointMatches = ncxContent.match(/<navPoint[^>]*>[\s\S]*?<\/navPoint>/g);
    const tocItems: TocItem[] = [];

    if (navPointMatches) {
      navPointMatches.forEach((navPoint, index) => {
        const idMatch = navPoint.match(/id="([^"]*)"/);
        const textMatch = navPoint.match(/<text>([^<]*)<\/text>/);
        const srcMatch = navPoint.match(/src="([^"]*)"/);

        if (idMatch && textMatch && srcMatch) {
          tocItems.push({
            id: idMatch[1],
            title: textMatch[1],
            href: srcMatch[1],
            level: 0
          });
        }
      });
    }

    return tocItems;
  }

  private async extractChapterContent(zip: JSZip, href: string, basePath: string): Promise<string> {
    const fullPath = this.resolvePath(href, basePath);
    const chapterFile = await zip.file(fullPath)?.async('string');
    
    if (!chapterFile) {
      return '<p>Chapter content not found</p>';
    }

    // Clean up the HTML content and process images
    const cleanedContent = this.cleanHtmlContent(chapterFile);
    return await this.processImages(zip, cleanedContent, basePath);
  }

  private resolvePath(href: string, basePath: string): string {
    if (href.startsWith('/')) {
      return href.substring(1);
    }
    
    const baseDir = basePath.substring(0, basePath.lastIndexOf('/') + 1);
    return baseDir + href;
  }

  private cleanHtmlContent(html: string): string {
    // Remove XML declarations and namespaces
    html = html.replace(/<\?xml[^>]*\?>/g, '');
    html = html.replace(/xmlns="[^"]*"/g, '');
    
    // Extract body content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (bodyMatch) {
      html = bodyMatch[1];
    }
    
    // Clean up common EPUB-specific elements
    html = html.replace(/<epub:switch[^>]*>[\s\S]*?<\/epub:switch>/gi, '');
    html = html.replace(/<epub:trigger[^>]*\/>/gi, '');
    
    return html;
  }

  private async processImages(zip: JSZip, html: string, basePath: string): Promise<string> {
    // Find all img tags in the HTML with different src formats
    const imgRegex = /<img[^>]*src=["']([^"']*)["'][^>]*>/gi;
    let match;
    let processedHtml = html;
    
    while ((match = imgRegex.exec(html)) !== null) {
      const imgTag = match[0];
      const imgSrc = match[1];
      
      try {
        // Handle different image reference formats
        let imgPath = imgSrc;
        
        // If it's a relative path, resolve it
        if (!imgSrc.startsWith('http') && !imgSrc.startsWith('data:')) {
          imgPath = this.resolvePath(imgSrc, basePath);
        }
        
        // Skip if it's already a data URL or external URL
        if (imgSrc.startsWith('data:') || imgSrc.startsWith('http')) {
          continue;
        }
        
        const imgFile = zip.file(imgPath);
        
        if (imgFile) {
          // Get the image as base64
          const imgData = await imgFile.async('base64');
          
          // Determine MIME type based on file extension
          const mimeType = this.getMimeType(imgPath);
          
          // Create data URL
          const dataUrl = `data:${mimeType};base64,${imgData}`;
          
          // Replace the src attribute with the data URL
          const newImgTag = imgTag.replace(/src=["'][^"']*["']/, `src="${dataUrl}"`);
          processedHtml = processedHtml.replace(imgTag, newImgTag);
          
          console.log(`Successfully processed image: ${imgPath}`);
        } else {
          console.warn(`Image not found: ${imgPath}`);
          // Try alternative paths
          const alternativePaths = [
            imgPath.replace(/^\.\//, ''),
            imgPath.replace(/^\.\.\//, ''),
            imgPath.split('/').pop(), // Just filename
            `images/${imgPath.split('/').pop()}`,
            `OEBPS/images/${imgPath.split('/').pop()}`,
          ];
          
          let found = false;
          for (const altPath of alternativePaths) {
            if (altPath) {
              const altFile = zip.file(altPath);
              if (altFile) {
                const imgData = await altFile.async('base64');
                const mimeType = this.getMimeType(altPath);
                const dataUrl = `data:${mimeType};base64,${imgData}`;
                const newImgTag = imgTag.replace(/src=["'][^"']*["']/, `src="${dataUrl}"`);
                processedHtml = processedHtml.replace(imgTag, newImgTag);
                console.log(`Found image at alternative path: ${altPath}`);
                found = true;
                break;
              }
            }
          }
          
          if (!found) {
            // Replace with a placeholder
            processedHtml = processedHtml.replace(imgTag, '<p style="color: #999; font-style: italic;">[Image not found: ' + imgPath.split('/').pop() + ']</p>');
          }
        }
      } catch (error) {
        console.error(`Error processing image ${imgSrc}:`, error);
        // Replace with error placeholder
        processedHtml = processedHtml.replace(imgTag, '<p style="color: #ff6b6b; font-style: italic;">[Image loading error]</p>');
      }
    }
    
    return processedHtml;
  }

  private getMimeType(filePath: string): string {
    const extension = filePath.toLowerCase().split('.').pop();
    switch (extension) {
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'png':
        return 'image/png';
      case 'gif':
        return 'image/gif';
      case 'svg':
        return 'image/svg+xml';
      case 'webp':
        return 'image/webp';
      default:
        return 'image/jpeg'; // Default fallback
    }
  }

  async parseEpubFile(): Promise<EpubBook> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/epub+zip',
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        throw new Error('No file selected');
      }

      const file = result.assets[0];
      console.log('Selected file:', file.name, file.uri);
      const bookId = this.generateBookId(file.name);
      
      // Read the EPUB file
      const fileContent = await FileSystem.readAsStringAsync(file.uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      console.log('File loaded, size:', fileContent.length);

      // Parse EPUB with JSZip
      const zip = new JSZip();
      await zip.loadAsync(fileContent, { base64: true });

      console.log('ZIP loaded, files:', Object.keys(zip.files));

      // Parse container.xml to find content.opf
      const opfPath = await this.parseContainerXml(zip);
      console.log('Found OPF path:', opfPath);
      
      // Parse content.opf
      const opfData = await this.parseContentOpf(zip, opfPath);
      const basePath = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);

      // Extract metadata
      const { metadata, manifest, spine } = opfData;

      // Find cover image
      const coverId = Object.keys(manifest).find(id => 
        manifest[id].mediaType === 'image/jpeg' || 
        manifest[id].mediaType === 'image/png'
      );
      const coverImage = coverId ? this.resolvePath(manifest[coverId].href, basePath) : undefined;

      // Parse table of contents (try to find NCX file)
      const ncxId = Object.keys(manifest).find(id => 
        manifest[id].mediaType === 'application/x-dtbncx+xml'
      );
      const ncxPath = ncxId ? this.resolvePath(manifest[ncxId].href, basePath) : undefined;
      const tableOfContents = ncxPath ? await this.parseNcx(zip, ncxPath) : [];

      // Extract chapters
      const chapters: EpubChapter[] = [];
      
      for (let i = 0; i < spine.length; i++) {
        const spineId = spine[i];
        const manifestItem = manifest[spineId];
        
        if (manifestItem && manifestItem.mediaType === 'application/xhtml+xml') {
          const href = manifestItem.href;
          const content = await this.extractChapterContent(zip, href, basePath);
          
          chapters.push({
            id: spineId,
            title: this.extractChapterTitle(content) || `Chapter ${i + 1}`,
            content,
            pageNumber: i + 1,
            href,
            spineIndex: i,
          });
        }
      }

      const book: EpubBook = {
        id: bookId,
        title: metadata.title,
        author: metadata.author,
        publisher: metadata.publisher,
        language: metadata.language,
        description: metadata.description,
        coverImage,
        chapters,
        tableOfContents,
        totalPages: chapters.length,
        filePath: file.uri,
        addedDate: new Date(),
      };

      // Save book to library
      await this.saveBookToLibrary(book);
      
      return book;
    } catch (error) {
      console.error('Error parsing EPUB:', error);
      throw error;
    }
  }

  private extractChapterTitle(content: string): string {
    const titleMatch = content.match(/<h[1-6][^>]*>([^<]+)<\/h[1-6]>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  private generateBookId(filename: string): string {
    return `book_${Date.now()}_${filename.replace(/[^a-zA-Z0-9]/g, '_')}`;
  }

  // Library Management
  async saveBookToLibrary(book: EpubBook): Promise<void> {
    try {
      const library = await this.getLibrary();
      const existingIndex = library.findIndex(b => b.id === book.id);
      
      if (existingIndex >= 0) {
        library[existingIndex] = { ...library[existingIndex], ...book };
      } else {
        library.push(book);
      }
      
      await AsyncStorage.setItem('epub_library', JSON.stringify(library));
    } catch (error) {
      console.error('Error saving book to library:', error);
    }
  }

  async getLibrary(): Promise<EpubBook[]> {
    try {
      const library = await AsyncStorage.getItem('epub_library');
      return library ? JSON.parse(library) : [];
    } catch (error) {
      console.error('Error loading library:', error);
      return [];
    }
  }

  async removeBookFromLibrary(bookId: string): Promise<void> {
    try {
      const library = await this.getLibrary();
      const updatedLibrary = library.filter(book => book.id !== bookId);
      await AsyncStorage.setItem('epub_library', JSON.stringify(updatedLibrary));
      
      // Also remove associated data
      await AsyncStorage.removeItem(`reading_progress_${bookId}`);
      await AsyncStorage.removeItem(`bookmarks_${bookId}`);
    } catch (error) {
      console.error('Error removing book from library:', error);
    }
  }

  // Reading Progress
  async saveReadingProgress(progress: ReadingProgress): Promise<void> {
    try {
      const key = `reading_progress_${progress.bookId}`;
      await AsyncStorage.setItem(key, JSON.stringify(progress));
      
      // Update book's last read date
      const library = await this.getLibrary();
      const bookIndex = library.findIndex(b => b.id === progress.bookId);
      if (bookIndex >= 0) {
        library[bookIndex].lastRead = new Date();
        await AsyncStorage.setItem('epub_library', JSON.stringify(library));
      }
    } catch (error) {
      console.error('Error saving reading progress:', error);
    }
  }

  async loadReadingProgress(bookId: string): Promise<ReadingProgress | null> {
    try {
      const key = `reading_progress_${bookId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error loading reading progress:', error);
      return null;
    }
  }

  // Bookmarks
  async saveBookmark(bookmark: Bookmark): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks(bookmark.bookId);
      bookmarks.push(bookmark);
      await AsyncStorage.setItem(`bookmarks_${bookmark.bookId}`, JSON.stringify(bookmarks));
    } catch (error) {
      console.error('Error saving bookmark:', error);
    }
  }

  async getBookmarks(bookId: string): Promise<Bookmark[]> {
    try {
      const bookmarks = await AsyncStorage.getItem(`bookmarks_${bookId}`);
      return bookmarks ? JSON.parse(bookmarks) : [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  }

  async removeBookmark(bookId: string, bookmarkId: string): Promise<void> {
    try {
      const bookmarks = await this.getBookmarks(bookId);
      const updatedBookmarks = bookmarks.filter((book: any) => book.id !== bookmarkId);
      await AsyncStorage.setItem(`bookmarks_${bookId}`, JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  }

  // Reading Sessions
  async saveReadingSession(session: ReadingSession): Promise<void> {
    try {
      const sessions = await this.getReadingSessions(session.bookId);
      sessions.push(session);
      await AsyncStorage.setItem(`reading_sessions_${session.bookId}`, JSON.stringify(sessions));
    } catch (error) {
      console.error('Error saving reading session:', error);
    }
  }

  async getReadingSessions(bookId: string): Promise<ReadingSession[]> {
    try {
      const sessions = await AsyncStorage.getItem(`reading_sessions_${bookId}`);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Error loading reading sessions:', error);
      return [];
    }
  }

  // Reading Statistics
  async getReadingStatistics(): Promise<ReadingStatistics> {
    try {
      const library = await this.getLibrary();
      const allSessions: ReadingSession[] = [];
      
      for (const book of library) {
        const sessions = await this.getReadingSessions(book.id);
        allSessions.push(...sessions);
      }

      const totalBooksRead = library.filter(book => book.lastRead).length;
      const totalPagesRead = allSessions.reduce((sum, session) => sum + session.pagesRead, 0);
      const totalReadingTime = allSessions.reduce((sum, session) => sum + session.readingTime, 0);
      const averageReadingSpeed = totalReadingTime > 0 ? totalPagesRead / totalReadingTime : 0;

      // Calculate reading streak
      const readingStreak = this.calculateReadingStreak(allSessions);

      return {
        totalBooksRead,
        totalPagesRead,
        totalReadingTime: totalReadingTime / 60, // Convert to hours
        averageReadingSpeed,
        readingStreak,
        favoriteGenres: [], // Would need genre data
        readingGoals: {
          dailyPages: 20,
          weeklyBooks: 1,
          monthlyPages: 500,
        },
      };
    } catch (error) {
      console.error('Error calculating reading statistics:', error);
      return {
        totalBooksRead: 0,
        totalPagesRead: 0,
        totalReadingTime: 0,
        averageReadingSpeed: 0,
        readingStreak: 0,
        favoriteGenres: [],
        readingGoals: {
          dailyPages: 20,
          weeklyBooks: 1,
          monthlyPages: 500,
        },
      };
    }
  }

  private calculateReadingStreak(sessions: ReadingSession[]): number {
    if (sessions.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const readingDates = new Set<string>();
    sessions.forEach(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      readingDates.add(sessionDate.toISOString().split('T')[0]);
    });

    let streak = 0;
    let currentDate = new Date(today);
    
    while (readingDates.has(currentDate.toISOString().split('T')[0])) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  // Generate HTML for reader
  generateReaderHTML(book: EpubBook, currentChapter: number = 0, theme: 'light' | 'dark' = 'light'): string {
    const chapter = book.chapters[currentChapter];
    const isDark = theme === 'dark';
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
        <style>
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          html, body {
            height: 100%;
            overflow: hidden;
            font-family: 'Georgia', 'Times New Roman', serif;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
          
          body {
            background-color: ${isDark ? '#1a1a1a' : '#f8f6f1'};
            color: ${isDark ? '#e0e0e0' : '#2c2c2c'};
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
          }
          
          .reader-container {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100vh;
            position: relative;
          }
          
          .content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            padding: 40px 20px;
            text-align: center;
            overflow: hidden;
          }
          
          .chapter-content {
            max-width: 90%;
            max-height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: clamp(16px, 4vw, 24px);
            line-height: 1.6;
            letter-spacing: 0.01em;
            word-spacing: 0.05em;
            text-align: justify;
            hyphens: auto;
            -webkit-hyphens: auto;
            -ms-hyphens: auto;
          }
          
          .chapter-title {
            font-size: clamp(20px, 5vw, 32px);
            font-weight: 600;
            margin-bottom: 30px;
            color: ${isDark ? '#ffffff' : '#1a1a1a'};
            line-height: 1.3;
            text-align: center;
            font-family: 'Georgia', 'Times New Roman', serif;
          }
          
          .text-content {
            font-size: clamp(16px, 4vw, 24px);
            line-height: 1.7;
            text-align: justify;
            max-width: 100%;
            word-wrap: break-word;
            overflow-wrap: break-word;
          }
          
          .text-content p {
            margin-bottom: 1.2em;
            text-indent: 2em;
            text-align: justify;
          }
          
          .text-content p:first-of-type {
            text-indent: 0;
          }
          
          .text-content h1, .text-content h2, .text-content h3 {
            margin: 1.5em 0 0.8em 0;
            font-weight: 600;
            text-align: center;
            text-indent: 0;
          }
          
          .text-content h1 { font-size: 1.4em; }
          .text-content h2 { font-size: 1.2em; }
          .text-content h3 { font-size: 1.1em; }
          
          .text-content blockquote {
            margin: 1.5em 0;
            padding: 1em 1.5em;
            border-left: 3px solid ${isDark ? '#007AFF' : '#007AFF'};
            background-color: ${isDark ? '#2a2a2a' : '#f0f0f0'};
            font-style: italic;
            text-align: left;
            text-indent: 0;
          }
          
          .text-content img {
            max-width: 100%;
            height: auto;
            margin: 1.5em auto;
            display: block;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            text-align: center;
          }
          
          .text-content img[style*="float: left"],
          .text-content img[style*="float:left"] {
            float: left;
            margin: 0 1em 1em 0;
            max-width: 50%;
          }
          
          .text-content img[style*="float: right"],
          .text-content img[style*="float:right"] {
            float: right;
            margin: 0 0 1em 1em;
            max-width: 50%;
          }
          
          .text-content figure {
            margin: 2em 0;
            text-align: center;
          }
          
          .text-content figure img {
            margin: 0 auto 0.5em auto;
          }
          
          .text-content figcaption {
            font-size: 0.9em;
            color: ${isDark ? '#cccccc' : '#666666'};
            font-style: italic;
            text-align: center;
            margin-top: 0.5em;
          }
          
          .bookmark-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: ${isDark ? '#333333' : '#ffffff'};
            color: ${isDark ? '#ffffff' : '#007AFF'};
            border: 2px solid ${isDark ? '#555555' : '#e0e0e0'};
            border-radius: 50%;
            width: 50px;
            height: 50px;
            font-size: 20px;
            cursor: pointer;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .bookmark-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
          }
          
          .bookmark-btn.bookmarked {
            background-color: #FF3B30;
            color: #ffffff;
            border-color: #FF3B30;
          }
          
          .navigation {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(transparent, ${isDark ? '#1a1a1a' : '#f8f6f1'} 30%);
            padding: 40px 20px 20px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          
          .navigation.visible {
            opacity: 1;
            pointer-events: all;
          }
          
          .nav-btn {
            background-color: ${isDark ? '#333333' : '#ffffff'};
            color: ${isDark ? '#ffffff' : '#2c2c2c'};
            border: 1px solid ${isDark ? '#555555' : '#e0e0e0'};
            border-radius: 25px;
            padding: 12px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          
          .nav-btn:hover {
            background-color: ${isDark ? '#444444' : '#f0f0f0'};
            transform: translateY(-1px);
          }
          
          .nav-btn:active {
            transform: translateY(0);
          }
          
          .progress-indicator {
            font-size: 14px;
            color: ${isDark ? '#cccccc' : '#666666'};
            font-weight: 500;
            text-align: center;
            flex: 1;
            margin: 0 20px;
          }
          
          .page-indicator {
            position: absolute;
            top: 20px;
            left: 20px;
            font-size: 12px;
            color: ${isDark ? '#888888' : '#999999'};
            font-weight: 500;
            background-color: ${isDark ? '#333333' : '#ffffff'};
            padding: 6px 12px;
            border-radius: 15px;
            border: 1px solid ${isDark ? '#555555' : '#e0e0e0'};
            box-shadow: 0 1px 4px rgba(0,0,0,0.1);
          }
          
          .settings-panel {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: ${isDark ? '#333333' : '#ffffff'};
            border-radius: 15px;
            padding: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            display: none;
            flex-direction: column;
            gap: 15px;
            min-width: 200px;
            z-index: 2000;
          }
          
          .settings-panel.visible {
            display: flex;
          }
          
          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid ${isDark ? '#555555' : '#e0e0e0'};
          }
          
          .setting-item:last-child {
            border-bottom: none;
          }
          
          .setting-label {
            font-size: 16px;
            color: ${isDark ? '#ffffff' : '#2c2c2c'};
          }
          
          .setting-control {
            display: flex;
            gap: 10px;
            align-items: center;
          }
          
          .font-size-btn {
            background-color: ${isDark ? '#555555' : '#f0f0f0'};
            color: ${isDark ? '#ffffff' : '#2c2c2c'};
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .font-size-btn.active {
            background-color: #007AFF;
            color: #ffffff;
          }
          
          .theme-toggle {
            background-color: ${isDark ? '#555555' : '#f0f0f0'};
            color: ${isDark ? '#ffffff' : '#2c2c2c'};
            border: none;
            border-radius: 20px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            transition: background-color 0.2s ease;
          }
          
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0,0,0,0.5);
            display: none;
            z-index: 1500;
          }
          
          .overlay.visible {
            display: block;
          }
        </style>
      </head>
      <body>
        <div class="reader-container">
          <div class="page-indicator">
            ${currentChapter + 1} / ${book.chapters.length}
          </div>
          
          <button class="bookmark-btn" id="bookmarkBtn" onclick="toggleBookmark()">🔖</button>
          
          <div class="content-area" onclick="toggleNavigation()">
            <div class="chapter-content">
              <h1 class="chapter-title">${chapter.title}</h1>
              <div class="text-content">
                ${chapter.content}
              </div>
            </div>
          </div>
          
          <div class="navigation" id="navigation">
            <button class="nav-btn" onclick="previousChapter()">◀ Previous</button>
            <div class="progress-indicator" id="progressText">
              Chapter ${currentChapter + 1} of ${book.chapters.length}
            </div>
            <button class="nav-btn" onclick="nextChapter()">Next ▶</button>
          </div>
          
          <div class="overlay" id="overlay" onclick="closeSettings()"></div>
          <div class="settings-panel" id="settingsPanel">
            <div class="setting-item">
              <span class="setting-label">Font Size</span>
              <div class="setting-control">
                <button class="font-size-btn" onclick="setFontSize('small')">S</button>
                <button class="font-size-btn active" onclick="setFontSize('medium')">M</button>
                <button class="font-size-btn" onclick="setFontSize('large')">L</button>
              </div>
            </div>
            <div class="setting-item">
              <span class="setting-label">Theme</span>
              <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
            </div>
          </div>
        </div>
        
        <script>
          let currentChapter = ${currentChapter};
          let totalChapters = ${book.chapters.length};
          let fontSize = 'medium';
          let isDarkTheme = ${isDark ? 'true' : 'false'};
          let isBookmarked = false;
          let navigationVisible = false;
          let settingsVisible = false;
          
          // Auto-resize text to fit container
          function autoResizeText() {
            const contentArea = document.querySelector('.content-area');
            const chapterContent = document.querySelector('.chapter-content');
            const textContent = document.querySelector('.text-content');
            
            if (!contentArea || !chapterContent || !textContent) return;
            
            const containerHeight = contentArea.clientHeight;
            const containerWidth = contentArea.clientWidth;
            
            // Start with a reasonable font size
            let fontSize = Math.min(containerWidth / 30, containerHeight / 20);
            fontSize = Math.max(16, Math.min(24, fontSize));
            
            textContent.style.fontSize = fontSize + 'px';
            
            // Adjust if content overflows
            while (chapterContent.scrollHeight > containerHeight && fontSize > 12) {
              fontSize -= 1;
              textContent.style.fontSize = fontSize + 'px';
            }
          }
          
          function updateProgress() {
            const progressText = document.getElementById('progressText');
            if (progressText) {
              progressText.textContent = \`Chapter \${currentChapter + 1} of \${totalChapters}\`;
            }
            
            // Send progress to React Native
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'progress',
              currentChapter: currentChapter,
              totalChapters: totalChapters,
              progress: ((currentChapter + 1) / totalChapters) * 100
            }));
          }
          
          function nextChapter() {
            if (currentChapter < totalChapters - 1) {
              currentChapter++;
              updateProgress();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'chapterChange',
                chapter: currentChapter
              }));
            }
          }
          
          function previousChapter() {
            if (currentChapter > 0) {
              currentChapter--;
              updateProgress();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'chapterChange',
                chapter: currentChapter
              }));
            }
          }
          
          function toggleNavigation() {
            const navigation = document.getElementById('navigation');
            navigationVisible = !navigationVisible;
            navigation.classList.toggle('visible', navigationVisible);
            
            // Auto-hide navigation after 3 seconds
            if (navigationVisible) {
              setTimeout(() => {
                navigationVisible = false;
                navigation.classList.remove('visible');
              }, 3000);
            }
          }
          
          function toggleBookmark() {
            isBookmarked = !isBookmarked;
            const btn = document.getElementById('bookmarkBtn');
            btn.classList.toggle('bookmarked', isBookmarked);
            
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'bookmark',
              bookmarked: isBookmarked,
              chapter: currentChapter
            }));
          }
          
          function setFontSize(size) {
            fontSize = size;
            const textContent = document.querySelector('.text-content');
            const buttons = document.querySelectorAll('.font-size-btn');
            
            // Update button states
            buttons.forEach(btn => btn.classList.remove('active'));
            event.target.classList.add('active');
            
            // Set font size
            const sizes = { small: '16px', medium: '20px', large: '24px' };
            textContent.style.fontSize = sizes[size];
            
            // Re-auto-resize after font change
            setTimeout(autoResizeText, 100);
          }
          
          function toggleTheme() {
            isDarkTheme = !isDarkTheme;
            document.body.style.backgroundColor = isDarkTheme ? '#1a1a1a' : '#f8f6f1';
            document.body.style.color = isDarkTheme ? '#e0e0e0' : '#2c2c2c';
            
            // Update all themed elements
            const elements = document.querySelectorAll('.nav-btn, .bookmark-btn, .page-indicator, .settings-panel');
            elements.forEach(el => {
              el.style.backgroundColor = isDarkTheme ? '#333333' : '#ffffff';
              el.style.color = isDarkTheme ? '#ffffff' : '#2c2c2c';
              el.style.borderColor = isDarkTheme ? '#555555' : '#e0e0e0';
            });
          }
          
          function showSettings() {
            settingsVisible = true;
            document.getElementById('overlay').classList.add('visible');
            document.getElementById('settingsPanel').classList.add('visible');
          }
          
          function closeSettings() {
            settingsVisible = false;
            document.getElementById('overlay').classList.remove('visible');
            document.getElementById('settingsPanel').classList.remove('visible');
          }
          
          // Initialize
          updateProgress();
          autoResizeText();
          
          // Handle window resize
          window.addEventListener('resize', autoResizeText);
          
          // Handle touch events for mobile
          let touchStartY = 0;
          let touchEndY = 0;
          
          document.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
          });
          
          document.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].clientY;
            const diff = touchStartY - touchEndY;
            
            if (Math.abs(diff) > 50) { // Minimum swipe distance
              if (diff > 0) {
                // Swipe up - next chapter
                nextChapter();
              } else {
                // Swipe down - previous chapter
                previousChapter();
              }
            }
          });
          
          // Double tap to show settings
          let lastTap = 0;
          document.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            if (tapLength < 500 && tapLength > 0) {
              showSettings();
            }
            lastTap = currentTime;
          });
        </script>
      </body>
      </html>
    `;
  }

  static async extractMetadataFromFile(filePath: string): Promise<Partial<EpubBook>> {
    try {
      const fileContent = await FileSystem.readAsStringAsync(filePath, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const zip = new JSZip();
      await zip.loadAsync(fileContent, { base64: true });
      // Parse container.xml to find content.opf
      const containerXml = await zip.file('META-INF/container.xml')?.async('string');
      if (!containerXml) throw new Error('Container.xml not found');
      let rootfileMatch = containerXml.match(/<rootfile[^>]*href="([^"]*)"[^>]*\/>/);
      if (!rootfileMatch) rootfileMatch = containerXml.match(/<rootfile[^>]*full-path="([^"]*)"[^>]*\/>/);
      if (!rootfileMatch) throw new Error('Rootfile not found in container.xml');
      const opfPath = rootfileMatch[1];
      const opfContent = await zip.file(opfPath)?.async('string');
      if (!opfContent) throw new Error('Content.opf not found');
      const titleMatch = opfContent.match(/<dc:title[^>]*>([^<]*)<\/dc:title>/);
      const authorMatch = opfContent.match(/<dc:creator[^>]*>([^<]*)<\/dc:creator>/);
      // Find cover image
      const manifestMatches = opfContent.match(/<item[^>]*\/>/g);
      let coverHref = undefined;
      if (manifestMatches) {
        for (const match of manifestMatches) {
          if (/cover/i.test(match) && /image\//i.test(match)) {
            const hrefMatch = match.match(/href="([^"]*)"/);
            if (hrefMatch) {
              coverHref = hrefMatch[1];
              break;
            }
          }
        }
      }
      return {
        id: filePath,
        title: titleMatch ? titleMatch[1] : 'Unknown Title',
        author: authorMatch ? authorMatch[1] : 'Unknown Author',
        coverImage: coverHref,
        filePath,
        addedDate: new Date(),
      };
    } catch (e) {
      return {
        id: filePath,
        title: 'Unreadable EPUB',
        author: '',
        filePath,
        addedDate: new Date(),
      };
    }
  }
}

export default new EpubParser(); 