import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MetricCard } from './MetricCard';
import { FinancialWidget } from './FinancialWidget';
import { AIInsightsList } from './AIInsights';
import { ApiService } from '../services/apiService';
import type { UserEntry, MoodEntry } from '../services/apiService';

export type Metric = {
  key: string;
  label: string;
  value: number | string;
  color: string;
  data: { date: string; value: number }[];
  category: 'fitness' | 'mindfulness' | 'financial';
  icon?: string;
  unit?: string;
};

interface DashboardGridProps {
  onMetricClick: (metric: Metric) => void;
  currentView: 'dashboard' | 'fitness' | 'mindfulness' | 'calendar' | 'insights';
}

export function DashboardGrid({ onMetricClick, currentView }: DashboardGridProps) {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentView === 'dashboard' || currentView === 'fitness' || currentView === 'mindfulness') {
      fetchMetrics();
    }
  }, [currentView]);

  const fetchMetrics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get the last 7 days of data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 7);

      const [userEntries, moodEntries] = await Promise.all([
        ApiService.getUserEntries({
          fromDate: startDate.toISOString().split('T')[0],
          toDate: endDate.toISOString().split('T')[0],
        }).catch(() => []), // Fallback to empty array if API fails
        ApiService.getMoodEntries({
          fromDate: startDate.toISOString().split('T')[0],
          toDate: endDate.toISOString().split('T')[0],
        }).catch(() => []), // Fallback to empty array if API fails
      ]);

      const processedMetrics = await processApiDataToMetrics(userEntries, moodEntries);
      setMetrics(processedMetrics);
    } catch (err) {
      console.error('Error fetching metrics:', err);
      setError('Failed to load data');
      // Fallback to sample data for development
      setMetrics(getSampleMetrics());
    } finally {
      setLoading(false);
    }
  };

  const processApiDataToMetrics = async (
    userEntries: UserEntry[], 
    moodEntries: MoodEntry[]
  ): Promise<Metric[]> => {
    const processedMetrics: Metric[] = [];

    // Group user entries by metric type
    const groupedEntries = userEntries.reduce((acc, entry) => {
      if (!acc[entry.metricType]) {
        acc[entry.metricType] = [];
      }
      acc[entry.metricType].push(entry);
      return acc;
    }, {} as { [key: string]: UserEntry[] });

    // Process each metric type
    Object.entries(groupedEntries).forEach(([metricType, entries]) => {
      const sortedEntries = entries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const latestEntry = sortedEntries[sortedEntries.length - 1];
      
      // Create data points for the last 7 days
      const data = sortedEntries.slice(-7).map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: Number(entry.value)
      }));

      processedMetrics.push({
        key: metricType,
        label: formatMetricLabel(metricType),
        value: Number(latestEntry.value),
        unit: latestEntry.unit || '',
        color: getMetricColor(metricType),
        category: getMetricCategory(metricType),
        icon: getMetricIcon(metricType),
        data: data.length > 0 ? data : [{ date: 'Today', value: Number(latestEntry.value) }]
      });
    });

    // Process mood entries
    if (moodEntries.length > 0) {
      const sortedMoodEntries = moodEntries.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      const latestMood = sortedMoodEntries[sortedMoodEntries.length - 1];
      const averageMood = moodEntries.reduce((sum, entry) => sum + entry.moodRating, 0) / moodEntries.length;
      
      const moodData = sortedMoodEntries.slice(-7).map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' }),
        value: entry.moodRating
      }));

      processedMetrics.push({
        key: 'mood',
        label: 'Mood',
        value: getMoodEmoji(latestMood.moodRating),
        color: 'bg-yellow-400',
        category: 'mindfulness',
        icon: '😊',
        data: moodData.length > 0 ? moodData : [{ date: 'Today', value: latestMood.moodRating }]
      });
    }

    return processedMetrics;
  };

  const getSampleMetrics = (): Metric[] => [
    {
      key: 'steps',
      label: 'Steps',
      value: 10234,
      color: 'bg-orange-400',
      category: 'fitness',
      icon: '👟',
      data: [
        { date: 'Mon', value: 8000 },
        { date: 'Tue', value: 9500 },
        { date: 'Wed', value: 12000 },
        { date: 'Thu', value: 11000 },
        { date: 'Fri', value: 10234 },
        { date: 'Sat', value: 9000 },
        { date: 'Sun', value: 10000 },
      ],
    },
    {
      key: 'calories',
      label: 'Calories',
      value: 2200,
      color: 'bg-red-400',
      category: 'fitness',
      icon: '🔥',
      data: [
        { date: 'Mon', value: 2100 },
        { date: 'Tue', value: 2000 },
        { date: 'Wed', value: 2300 },
        { date: 'Thu', value: 2250 },
        { date: 'Fri', value: 2200 },
        { date: 'Sat', value: 2150 },
        { date: 'Sun', value: 2100 },
      ],
    },
    {
      key: 'mood',
      label: 'Mood',
      value: '😊',
      color: 'bg-yellow-400',
      category: 'mindfulness',
      icon: '😊',
      data: [
        { date: 'Mon', value: 3 },
        { date: 'Tue', value: 4 },
        { date: 'Wed', value: 5 },
        { date: 'Thu', value: 4 },
        { date: 'Fri', value: 4 },
        { date: 'Sat', value: 5 },
        { date: 'Sun', value: 4 },
      ],
    },
  ];

  const formatMetricLabel = (metricType: string): string => {
    return metricType.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getMetricColor = (metricType: string): string => {
    const colors: { [key: string]: string } = {
      'steps': 'bg-orange-400',
      'calories': 'bg-red-400',
      'weight': 'bg-purple-400',
      'sleep': 'bg-indigo-400',
      'water': 'bg-blue-400',
      'exercise': 'bg-green-400',
      'meditation': 'bg-pink-400',
      'reading': 'bg-emerald-400',
    };
    return colors[metricType] || 'bg-stone-400';
  };

  const getMetricCategory = (metricType: string): 'fitness' | 'mindfulness' | 'financial' => {
    const mindfulnessMetrics = ['meditation', 'journal', 'prayer', 'reading', 'gratitude'];
    const fitnessMetrics = ['steps', 'calories', 'weight', 'sleep', 'water', 'exercise', 'workouts', 'active_minutes'];
    
    if (mindfulnessMetrics.includes(metricType)) return 'mindfulness';
    if (fitnessMetrics.includes(metricType)) return 'fitness';
    return 'fitness'; // Default to fitness
  };

  const getMetricIcon = (metricType: string): string => {
    const icons: { [key: string]: string } = {
      'steps': '👟',
      'calories': '🔥',
      'weight': '⚖️',
      'sleep': '😴',
      'water': '💧',
      'exercise': '💪',
      'meditation': '🧘',
      'journal': '📝',
      'prayer': '🙏',
      'reading': '📚',
      'gratitude': '🙏',
    };
    return icons[metricType] || '📊';
  };

  const getMoodEmoji = (rating: number): string => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '😊';
    return '😄';
  };

  const filterMetricsByView = (metrics: Metric[]): Metric[] => {
    if (currentView === 'fitness') {
      return metrics.filter(m => m.category === 'fitness');
    }
    if (currentView === 'mindfulness') {
      return metrics.filter(m => m.category === 'mindfulness');
    }
    return metrics; // Dashboard shows all
  };

  const filteredMetrics = filterMetricsByView(metrics);

  if (currentView === 'insights') {
    return <AIInsightsList className="max-w-4xl mx-auto" />;
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-32 bg-stone-200 dark:bg-stone-700 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error && metrics.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">Unable to load data</h3>
        <p className="text-stone-600 dark:text-stone-400 mb-4">{error}</p>
        <button
          onClick={fetchMetrics}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {/* Metrics Cards */}
          {filteredMetrics.map((metric) => (
            <motion.div
              key={metric.key}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <MetricCard metric={metric} onClick={() => onMetricClick(metric)} />
            </motion.div>
          ))}

          {/* Financial Widget - only show on dashboard */}
          {currentView === 'dashboard' && (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <FinancialWidget onClick={() => {
                // Create a financial metric to open modal
                const financialMetric: Metric = {
                  key: 'financial',
                  label: 'Financial Overview',
                  value: '$17,000',
                  color: 'bg-green-400',
                  category: 'financial',
                  icon: '💰',
                  data: []
                };
                onMetricClick(financialMetric);
              }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {filteredMetrics.length === 0 && !loading && !error && (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-stone-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-50 mb-2">No data yet</h3>
          <p className="text-stone-600 dark:text-stone-400 mb-4">
            Start tracking your {currentView === 'dashboard' ? 'daily activities' : currentView} to see your progress here.
          </p>
        </div>
      )}
    </div>
  );
}