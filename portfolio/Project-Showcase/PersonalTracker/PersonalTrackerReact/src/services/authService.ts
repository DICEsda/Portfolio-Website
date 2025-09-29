import { ApiService } from './apiService';

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

export interface AuthUser {
  id?: number;
  googleId: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

export class AuthService {
  private static listeners: ((state: AuthState) => void)[] = [];
  private static currentState: AuthState = {
    isAuthenticated: false,
    user: null,
    token: localStorage.getItem('authToken'),
    loading: true,
  };

  // Initialize the service
  static async initialize(): Promise<void> {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const isValid = await ApiService.validateToken(token);
        if (isValid.valid) {
          const user = await ApiService.getCurrentUser();
          this.updateState({
            isAuthenticated: true,
            user,
            token,
            loading: false,
          });
          return;
        }
      } catch (error) {
        console.error('Token validation failed:', error);
        localStorage.removeItem('authToken');
      }
    }
    
    this.updateState({
      isAuthenticated: false,
      user: null,
      token: null,
      loading: false,
    });
  }

  // Subscribe to auth state changes
  static subscribe(callback: (state: AuthState) => void): () => void {
    this.listeners.push(callback);
    
    // Call immediately with current state
    callback(this.currentState);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Get current auth state
  static getState(): AuthState {
    return { ...this.currentState };
  }

  // Update state and notify listeners
  private static updateState(newState: Partial<AuthState>): void {
    this.currentState = { ...this.currentState, ...newState };
    this.listeners.forEach(listener => listener(this.currentState));
  }

  // Initialize Google OAuth
  static async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') {
        reject(new Error('Window is not available'));
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: this.handleGoogleCallback.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          resolve();
        } else {
          reject(new Error('Google Identity Services failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
      
      document.head.appendChild(script);
    });
  }

  // Handle Google OAuth callback
  private static async handleGoogleCallback(response: any): Promise<void> {
    try {
      this.updateState({ loading: true });
      
      const authResult = await ApiService.authenticateWithGoogle(response.credential);
      
      localStorage.setItem('authToken', authResult.token);
      
      this.updateState({
        isAuthenticated: true,
        user: authResult.user,
        token: authResult.token,
        loading: false,
      });
    } catch (error) {
      console.error('Google authentication failed:', error);
      this.updateState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    }
  }

  // Sign in with Google
  static async signInWithGoogle(): Promise<void> {
    try {
      await this.initializeGoogleAuth();
      
      if (window.google) {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google Sign-In prompt was not displayed or was skipped');
          }
        });
      }
    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
      throw error;
    }
  }

  // Render Google Sign-In button
  static renderGoogleSignInButton(elementId: string, theme: 'outline' | 'filled_blue' | 'filled_black' = 'outline'): void {
    if (window.google) {
      window.google.accounts.id.renderButton(
        document.getElementById(elementId),
        {
          theme,
          size: 'large',
          type: 'standard',
          shape: 'rounded',
          text: 'signin_with',
          locale: 'en',
        }
      );
    }
  }

  // Sign out
  static async signOut(): Promise<void> {
    try {
      localStorage.removeItem('authToken');
      
      // Sign out from Google
      if (window.google) {
        window.google.accounts.id.disableAutoSelect();
      }
      
      this.updateState({
        isAuthenticated: false,
        user: null,
        token: null,
        loading: false,
      });
    } catch (error) {
      console.error('Sign out failed:', error);
      throw error;
    }
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.currentState.isAuthenticated;
  }

  // Get current user
  static getCurrentUser(): AuthUser | null {
    return this.currentState.user;
  }

  // Get current token
  static getToken(): string | null {
    return this.currentState.token;
  }
}

// Extend Window interface for Google Identity Services
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          prompt: (callback?: (notification: any) => void) => void;
          renderButton: (parent: HTMLElement | null, options: any) => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}