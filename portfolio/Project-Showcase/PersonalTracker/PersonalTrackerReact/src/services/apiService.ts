// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('authToken');
      window.location.href = '/';
      return;
    }
    const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }
  return response.json();
};

// Types
export interface UserEntry {
  id?: number;
  userId?: number;
  metricType: string;
  value: number;
  unit?: string;
  date: string;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MoodEntry {
  id?: number;
  userId?: number;
  moodRating: number;
  moodLabel?: string;
  notes?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalEntry {
  id?: number;
  userId?: number;
  title: string;
  content: string;
  tags?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialEntry {
  id?: number;
  userId?: number;
  entryType: string;
  category: string;
  amount: number;
  currency: string;
  description?: string;
  accountName?: string;
  date: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AIInsight {
  id?: number;
  userId?: number;
  insightType: string;
  title: string;
  content: string;
  dataSummary?: string;
  generatedAt: string;
  expiresAt?: string;
  isRead: boolean;
}

export interface User {
  id?: number;
  googleId: string;
  email: string;
  name?: string;
  profilePictureUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

// API Service Class
export class ApiService {
  // User Entries
  static async getUserEntries(params?: {
    metricType?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<UserEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.metricType) queryParams.append('metricType', params.metricType);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const response = await fetch(`${API_BASE_URL}/api/userentries?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async createUserEntry(entry: UserEntry): Promise<UserEntry> {
    const response = await fetch(`${API_BASE_URL}/api/userentries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    return handleResponse(response);
  }

  static async updateUserEntry(id: number, entry: UserEntry): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/userentries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to update entry');
  }

  static async deleteUserEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/userentries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete entry');
  }

  static async getAvailableMetrics(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/userentries/metrics`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Mood Entries
  static async getMoodEntries(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<MoodEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const response = await fetch(`${API_BASE_URL}/api/moodentries?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async createMoodEntry(entry: MoodEntry): Promise<MoodEntry> {
    const response = await fetch(`${API_BASE_URL}/api/moodentries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    return handleResponse(response);
  }

  static async updateMoodEntry(id: number, entry: MoodEntry): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/moodentries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to update mood entry');
  }

  static async deleteMoodEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/moodentries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete mood entry');
  }

  static async getMoodAnalytics(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const response = await fetch(`${API_BASE_URL}/api/moodentries/analytics?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Journal Entries
  static async getJournalEntries(params?: {
    fromDate?: string;
    toDate?: string;
    searchTerm?: string;
  }): Promise<JournalEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);
    if (params?.searchTerm) queryParams.append('searchTerm', params.searchTerm);

    const response = await fetch(`${API_BASE_URL}/api/journalentries?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async createJournalEntry(entry: JournalEntry): Promise<JournalEntry> {
    const response = await fetch(`${API_BASE_URL}/api/journalentries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    return handleResponse(response);
  }

  static async updateJournalEntry(id: number, entry: JournalEntry): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/journalentries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to update journal entry');
  }

  static async deleteJournalEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/journalentries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete journal entry');
  }

  static async getJournalTags(): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/api/journalentries/tags`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // Financial Entries
  static async getFinancialEntries(params?: {
    entryType?: string;
    category?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<FinancialEntry[]> {
    const queryParams = new URLSearchParams();
    if (params?.entryType) queryParams.append('entryType', params.entryType);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const response = await fetch(`${API_BASE_URL}/api/financialentries?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async createFinancialEntry(entry: FinancialEntry): Promise<FinancialEntry> {
    const response = await fetch(`${API_BASE_URL}/api/financialentries`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    return handleResponse(response);
  }

  static async updateFinancialEntry(id: number, entry: FinancialEntry): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/financialentries/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(entry),
    });
    if (!response.ok) throw new Error('Failed to update financial entry');
  }

  static async deleteFinancialEntry(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/financialentries/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete financial entry');
  }

  static async getFinancialSummary(params?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<any> {
    const queryParams = new URLSearchParams();
    if (params?.fromDate) queryParams.append('fromDate', params.fromDate);
    if (params?.toDate) queryParams.append('toDate', params.toDate);

    const response = await fetch(`${API_BASE_URL}/api/financialentries/summary?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async getFinancialCategories(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/financialentries/categories`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  // AI Insights
  static async getAIInsights(params?: {
    insightType?: string;
    includeRead?: boolean;
  }): Promise<AIInsight[]> {
    const queryParams = new URLSearchParams();
    if (params?.insightType) queryParams.append('insightType', params.insightType);
    if (params?.includeRead !== undefined) queryParams.append('includeRead', params.includeRead.toString());

    const response = await fetch(`${API_BASE_URL}/api/aiinsights?${queryParams}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async generateAIInsight(params: {
    insightType: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<AIInsight> {
    const response = await fetch(`${API_BASE_URL}/api/aiinsights/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return handleResponse(response);
  }

  static async markInsightAsRead(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/aiinsights/${id}/mark-read`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to mark insight as read');
  }

  static async deleteAIInsight(id: number): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/aiinsights/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete insight');
  }

  // Authentication
  static async authenticateWithGoogle(token: string): Promise<{ token: string; user: User }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  }

  static async validateToken(token: string): Promise<{ valid: boolean; userId?: string }> {
    const response = await fetch(`${API_BASE_URL}/api/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });
    return handleResponse(response);
  }

  // Users
  static async getCurrentUser(): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }

  static async updateCurrentUser(user: Partial<User>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error('Failed to update user');
  }

  static async getDashboardStats(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/users/dashboard-stats`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  }
}