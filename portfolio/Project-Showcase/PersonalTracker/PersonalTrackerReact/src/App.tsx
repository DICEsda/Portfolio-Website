import { useState } from 'react'
import './index.css'
import { DashboardGrid } from './components/DashboardGrid'
import { MetricGraphModal } from './components/MetricGraphModal'
import { Navbar } from './components/Navbar'
import { GoogleCalendar } from './components/GoogleCalendar'
import { AuthCallback } from './components/AuthCallback'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { motion, AnimatePresence } from 'framer-motion'

export type Metric = {
  key: string;
  label: string;
  value: number | string;
  color: string;
  data: { date: string; value: number }[];
  category: 'fitness' | 'mindfulness';
  icon?: string;
};

const allMetrics: Metric[] = [
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
    key: 'active-minutes',
    label: 'Active Minutes',
    value: 120,
    color: 'bg-green-400',
    category: 'fitness',
    icon: '⚡',
    data: [
      { date: 'Mon', value: 100 },
      { date: 'Tue', value: 110 },
      { date: 'Wed', value: 120 },
      { date: 'Thu', value: 130 },
      { date: 'Fri', value: 120 },
      { date: 'Sat', value: 110 },
      { date: 'Sun', value: 120 },
    ],
  },
  {
    key: 'workouts',
    label: 'Workouts',
    value: 5,
    color: 'bg-blue-400',
    category: 'fitness',
    icon: '💪',
    data: [
      { date: 'Mon', value: 1 },
      { date: 'Tue', value: 0 },
      { date: 'Wed', value: 1 },
      { date: 'Thu', value: 1 },
      { date: 'Fri', value: 0 },
      { date: 'Sat', value: 1 },
      { date: 'Sun', value: 1 },
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
      { date: 'Fri', value: 3 },
      { date: 'Sat', value: 4 },
      { date: 'Sun', value: 5 },
    ],
  },
  {
    key: 'meditation',
    label: 'Meditation Minutes',
    value: 60,
    color: 'bg-purple-400',
    category: 'mindfulness',
    icon: '🧘',
    data: [
      { date: 'Mon', value: 10 },
      { date: 'Tue', value: 20 },
      { date: 'Wed', value: 30 },
      { date: 'Thu', value: 40 },
      { date: 'Fri', value: 50 },
      { date: 'Sat', value: 60 },
      { date: 'Sun', value: 60 },
    ],
  },
  {
    key: 'journal',
    label: 'Journal Entries',
    value: 5,
    color: 'bg-indigo-400',
    category: 'mindfulness',
    icon: '📝',
    data: [
      { date: 'Mon', value: 1 },
      { date: 'Tue', value: 0 },
      { date: 'Wed', value: 1 },
      { date: 'Thu', value: 1 },
      { date: 'Fri', value: 0 },
      { date: 'Sat', value: 1 },
      { date: 'Sun', value: 1 },
    ],
  },
  {
    key: 'prayer',
    label: 'Prayer Streak',
    value: '7 days',
    color: 'bg-orange-500',
    category: 'mindfulness',
    icon: '🙏',
    data: [
      { date: 'Mon', value: 1 },
      { date: 'Tue', value: 1 },
      { date: 'Wed', value: 1 },
      { date: 'Thu', value: 1 },
      { date: 'Fri', value: 1 },
      { date: 'Sat', value: 1 },
      { date: 'Sun', value: 1 },
    ],
  },
];

// Fitness Page - Modern Card Layout
function Fitness() {
  const fitnessMetrics = allMetrics.filter(m => m.category === 'fitness');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-stone-900 dark:to-stone-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">Fitness Dashboard</h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">Track your physical wellness journey</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {fitnessMetrics.map((metric, idx) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl p-6 cursor-pointer border border-stone-200 dark:border-stone-700"
              onClick={() => setSelectedMetric(metric)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{metric.icon}</span>
                <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{metric.label}</h3>
              <p className="text-3xl font-bold text-stone-900 dark:text-stone-50">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl p-8 border border-stone-200 dark:border-stone-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedMetric.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{selectedMetric.label}</h2>
                  <p className="text-stone-600 dark:text-stone-300">Last 7 days trend</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-50 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-80">
              <MetricGraph metric={selectedMetric} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Mindfulness Page - Circular Layout
function Mindfulness() {
  const mindfulnessMetrics = allMetrics.filter(m => m.category === 'mindfulness');
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-stone-900 dark:to-stone-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">Mindfulness Hub</h1>
          <p className="text-xl text-stone-600 dark:text-stone-300">Nurture your mental well-being</p>
        </motion.div>

        <div className="flex justify-center mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
            {mindfulnessMetrics.map((metric, idx) => (
              <motion.div
                key={metric.key}
                initial={{ opacity: 0, scale: 0.8, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="bg-white dark:bg-stone-800 rounded-full aspect-square shadow-xl p-6 cursor-pointer border border-stone-200 dark:border-stone-700 flex flex-col items-center justify-center"
                onClick={() => setSelectedMetric(metric)}
              >
                <span className="text-4xl mb-3">{metric.icon}</span>
                <h3 className="text-sm font-semibold text-stone-800 dark:text-stone-100 text-center mb-2">{metric.label}</h3>
                <p className="text-xl font-bold text-stone-900 dark:text-stone-50">{metric.value}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl p-8 border border-stone-200 dark:border-stone-700 max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{selectedMetric.icon}</span>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{selectedMetric.label}</h2>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-50 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-80">
              <MetricGraph metric={selectedMetric} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Dashboard Page - Customizable with Metric Selection
function Dashboard() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['steps', 'mood']);
  const [selectedMetric, setSelectedMetric] = useState<Metric | null>(null);
  const [showMetricSelector, setShowMetricSelector] = useState(false);

  const dashboardMetrics = allMetrics.filter(m => selectedMetrics.includes(m.key));

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics(prev => 
      prev.includes(metricKey) 
        ? prev.filter(key => key !== metricKey)
        : [...prev, metricKey]
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 to-gray-50 dark:from-stone-900 dark:to-stone-800 p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-stone-800 dark:text-stone-100 mb-4">Personal Dashboard</h1>
          <p className="text-xl text-stone-600 dark:text-stone-300 mb-6">Your key metrics at a glance</p>
          <button
            onClick={() => setShowMetricSelector(!showMetricSelector)}
            className="bg-stone-800 dark:bg-stone-100 text-stone-100 dark:text-stone-800 px-6 py-3 rounded-xl font-semibold hover:bg-stone-700 dark:hover:bg-stone-200 transition-colors"
          >
            {showMetricSelector ? 'Done' : 'Customize Dashboard'}
          </button>
        </motion.div>

        {showMetricSelector && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-6 mb-8 border border-stone-200 dark:border-stone-700"
          >
            <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-4">Select Metrics for Dashboard</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {allMetrics.map(metric => (
                <button
                  key={metric.key}
                  onClick={() => toggleMetric(metric.key)}
                  className={`p-3 rounded-xl border-2 transition-all ${
                    selectedMetrics.includes(metric.key)
                      ? 'border-stone-800 dark:border-stone-100 bg-stone-100 dark:bg-stone-700'
                      : 'border-stone-200 dark:border-stone-600 hover:border-stone-400 dark:hover:border-stone-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{metric.icon}</span>
                    <span className="text-sm font-medium text-stone-800 dark:text-stone-100">{metric.label}</span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardMetrics.map((metric, idx) => (
            <motion.div
              key={metric.key}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              className="bg-white dark:bg-stone-800 rounded-2xl shadow-lg p-6 cursor-pointer border border-stone-200 dark:border-stone-700"
              onClick={() => setSelectedMetric(metric)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl">{metric.icon}</span>
                <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
              </div>
              <h3 className="text-lg font-semibold text-stone-800 dark:text-stone-100 mb-2">{metric.label}</h3>
              <p className="text-2xl font-bold text-stone-900 dark:text-stone-50">{metric.value}</p>
            </motion.div>
          ))}
        </div>

        {selectedMetric && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 bg-white dark:bg-stone-800 rounded-2xl shadow-xl p-8 border border-stone-200 dark:border-stone-700"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <span className="text-3xl">{selectedMetric.icon}</span>
                <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50">{selectedMetric.label}</h2>
              </div>
              <button
                onClick={() => setSelectedMetric(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-50 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="h-80">
              <MetricGraph metric={selectedMetric} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

// Add a MetricGraph component for the chart only
function MetricGraph({ metric }: { metric: Metric }) {
  // Helper functions for stats
  const average = (arr: number[]) => arr.length ? Math.round(arr.reduce((a: number, b: number) => a + b, 0) / arr.length) : 0;
  const sum = (arr: number[]) => arr.reduce((a, b) => a + b, 0);
  const streak = (arr: (number | string)[]) => {
    let max = 0, cur = 0;
    for (let v of arr) {
      if (Number(v)) cur++; else cur = 0;
      if (cur > max) max = cur;
    }
    return max;
  };
  const values = metric.data.map(d => Number(d.value)).filter(v => !isNaN(v));
  const isMood = metric.label.toLowerCase().includes('mood');
  const isSteps = metric.label.toLowerCase().includes('step');
  const isCalories = metric.label.toLowerCase().includes('calorie');
  const isActive = metric.label.toLowerCase().includes('active');
  const isJournal = metric.label.toLowerCase().includes('journal');
  const isPrayer = metric.label.toLowerCase().includes('prayer');
  const isMeditation = metric.label.toLowerCase().includes('meditation');

  // Mood emoji axis
  const moodTicks = [1, 2, 3, 4, 5];
  const moodEmojis = ['😞', '😕', '😐', '🙂', '😊'];

  return (
    <div className="flex flex-col gap-4">
      <ResponsiveContainer width="100%" height={250}>
        {isMood ? (
          <LineChart data={metric.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#fafaf9" />
            <XAxis dataKey="date" stroke="#78716c" />
            <YAxis stroke="#78716c" domain={[1, 5]} ticks={moodTicks} tickFormatter={v => moodEmojis[v - 1]} />
            <Tooltip contentStyle={{ background: '#fafaf9', color: '#292524', borderColor: '#a8a29e' }} wrapperStyle={{ borderRadius: '0.75rem' }} formatter={v => moodEmojis[v - 1] || v} />
            <Line type="monotone" dataKey="value" stroke="#57534e" strokeWidth={3} dot={{ r: 7, fill: '#57534e' }} />
          </LineChart>
        ) : (
          <LineChart data={metric.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="0" stroke="#fafaf9" />
            <XAxis dataKey="date" stroke="#78716c" />
            <YAxis stroke="#78716c" />
            <Tooltip contentStyle={{ background: '#fafaf9', color: '#292524', borderColor: '#a8a29e' }} wrapperStyle={{ borderRadius: '0.75rem' }} />
            <Line type="monotone" dataKey="value" stroke="#57534e" strokeWidth={3} dot={{ r: 5, fill: '#57534e' }} />
          </LineChart>
        )}
      </ResponsiveContainer>
      {/* Stats summary */}
      <div className="mt-2 text-sm text-stone-600 dark:text-stone-300 flex flex-wrap gap-4">
        {isMood && <span>Average: {average(values)} {moodEmojis[average(values) - 1]}</span>}
        {(isSteps || isCalories || isActive) && <span>Average: {average(values).toLocaleString()}</span>}
        {(isJournal || isPrayer || isMeditation) && <span>Streak: {streak(values)}</span>}
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.main
        key={location.pathname}
        className="main-container py-8"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -24 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/fitness" element={<Fitness />} />
          <Route path="/mindfulness" element={<Mindfulness />} />
          <Route path="/calendar" element={<GoogleCalendar />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      </motion.main>
    </AnimatePresence>
  );
}

export function App() {
  return (
    <Router>
      <div className="min-h-screen app-bg">
        <Navbar />
        <AnimatedRoutes />
      </div>
    </Router>
  );
}

export default App
