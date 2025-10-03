import type { FC } from 'react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ApiService, AIInsight } from '../services/apiService';

interface AIInsightCardProps {
  insight: AIInsight;
  onMarkRead?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const AIInsightCard: FC<AIInsightCardProps> = ({ insight, onMarkRead, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'weekly_summary':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
          </svg>
        );
      case 'mood_pattern':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <path d="8 14s1.5 2 4 2 4-2 4-2"/>
            <line x1="9" y1="9" x2="9.01" y2="9"/>
            <line x1="15" y1="9" x2="15.01" y2="9"/>
          </svg>
        );
      case 'fitness_trend':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        );
      case 'financial_insight':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        );
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'weekly_summary': return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400';
      case 'mood_pattern': return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400';
      case 'fitness_trend': return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400';
      case 'financial_insight': return 'bg-orange-100 text-orange-600 dark:bg-orange-900 dark:text-orange-400';
      default: return 'bg-stone-100 text-stone-600 dark:bg-stone-700 dark:text-stone-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative rounded-2xl shadow-lg p-6 border transition-all duration-200 ${
        insight.isRead 
          ? 'bg-stone-50 dark:bg-stone-900 border-stone-200 dark:border-stone-800 opacity-75' 
          : 'bg-white dark:bg-stone-800 border-stone-200 dark:border-stone-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${getInsightColor(insight.insightType)}`}>
            {getInsightIcon(insight.insightType)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50">
              {insight.title}
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {formatDate(insight.generatedAt)}
            </p>
          </div>
        </div>
        
        {/* Actions */}
        <div className="flex items-center space-x-2">
          {!insight.isRead && onMarkRead && (
            <button
              onClick={() => onMarkRead(insight.id!)}
              className="p-2 rounded-lg bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors"
              title="Mark as read"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="20,6 9,17 4,12"/>
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(insight.id!)}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
              title="Delete insight"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <polyline points="3,6 5,6 21,6"/>
                <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-sm max-w-none text-stone-700 dark:text-stone-300">
        <p>{insight.content}</p>
      </div>

      {/* Expiry indicator */}
      {insight.expiresAt && (
        <div className="mt-4 text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200 dark:border-stone-700 pt-3">
          Expires: {formatDate(insight.expiresAt)}
        </div>
      )}
    </motion.div>
  );
};

interface AIInsightsListProps {
  className?: string;
}

export const AIInsightsList: FC<AIInsightsListProps> = ({ className = '' }) => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchInsights();
  }, [filter]);

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAIInsights({ 
        includeRead: filter === 'all' 
      });
      setInsights(data);
    } catch (err) {
      setError('Failed to fetch insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await ApiService.markInsightAsRead(id);
      setInsights(prev => 
        prev.map(insight => 
          insight.id === id ? { ...insight, isRead: true } : insight
        )
      );
    } catch (err) {
      console.error('Error marking insight as read:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await ApiService.deleteAIInsight(id);
      setInsights(prev => prev.filter(insight => insight.id !== id));
    } catch (err) {
      console.error('Error deleting insight:', err);
    }
  };

  const generateInsight = async (type: string) => {
    try {
      setLoading(true);
      const newInsight = await ApiService.generateAIInsight({ insightType: type });
      setInsights(prev => [newInsight, ...prev]);
    } catch (err) {
      setError('Failed to generate insight');
      console.error('Error generating insight:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && insights.length === 0) {
    return (
      <div className={`${className}`}>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">AI Insights</h2>
          <p className="text-stone-600 dark:text-stone-400">Personalized insights from your data</p>
        </div>
        
        {/* Generate Insight Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => generateInsight('weekly_summary')}
            className="px-4 py-2 rounded-lg bg-orange-100 text-orange-700 hover:bg-orange-200 dark:bg-orange-900 dark:text-orange-300 dark:hover:bg-orange-800 transition-colors text-sm font-medium"
          >
            Weekly Summary
          </button>
          <button
            onClick={() => generateInsight('mood_pattern')}
            className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900 dark:text-purple-300 dark:hover:bg-purple-800 transition-colors text-sm font-medium"
          >
            Mood Analysis
          </button>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all' 
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' 
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          All Insights
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'unread' 
              ? 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' 
              : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800'
          }`}
        >
          Unread Only
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 rounded-lg p-4 mb-6">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Insights List */}
      <div className="space-y-4">
        {insights.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">No insights yet</h3>
            <p className="text-stone-600 dark:text-stone-400 mb-4">Generate your first AI insight to get personalized analysis of your data.</p>
          </div>
        ) : (
          insights.map((insight) => (
            <AIInsightCard
              key={insight.id}
              insight={insight}
              onMarkRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};