import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { createContext, useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import { ThemeToggle } from './components/theme-toggle';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from './api';
import CreateExam from './pages/CreateExam';
import AddStudents from './pages/AddStudents';
import StartExam from './pages/StartExam';
import History from './pages/History';

export interface Exam {
  id: string;
  course: string;
  term: string;
  date: string;
  numQuestions: number;
  duration: number;
  startTime: string;
  students: Student[];
  results?: ExamResult[];
}

export interface Student {
  name: string;
  studentNumber: string;
}

export interface ExamResult {
  studentNumber: string;
  question: string;
  duration: number;
  notes: string;
  grade: string;
}

export const ExamsContext = createContext<{
  exams: Exam[];
  setExams: React.Dispatch<React.SetStateAction<Exam[]>>;
}>({ exams: [], setExams: () => {} });

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-full"
          >
            <CreateExam />
          </motion.div>
        } />
        <Route path="/add-students" element={
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-full"
          >
            <AddStudents />
          </motion.div>
        } />
        <Route path="/start-exam" element={
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-full"
          >
            <StartExam />
          </motion.div>
        } />
        <Route path="/history" element={
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="h-full"
          >
            <History />
          </motion.div>
        } />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load exams from API on component mount
  useEffect(() => {
    const loadExams = async () => {
      try {
        setLoading(true);
        const examsData = await api.getExams();
        setExams(examsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load exams:', err);
        setError('Failed to load exams. Please make sure the server is running.');
      } finally {
        setLoading(false);
      }
    };

    loadExams();
  }, []);

  // Update exams in API whenever exams state changes
  const updateExams = async (newExams: Exam[] | ((prev: Exam[]) => Exam[])) => {
    try {
      const updatedExams = typeof newExams === 'function' ? newExams(exams) : newExams;
      setExams(updatedExams);
      
      // Sync with API - this is a simplified approach
      // In a real app, you might want to handle individual CRUD operations
      for (const exam of updatedExams) {
        if (exam.id) {
          await api.updateExam(exam.id, exam);
        }
      }
    } catch (err) {
      console.error('Failed to update exams:', err);
      setError('Failed to save changes. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-neutral-200 dark:bg-stone-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen bg-neutral-200 dark:bg-stone-800 flex items-center justify-center">
        <div className="text-gray-900 dark:text-white text-xl text-center">
          <div className="text-red-400 mb-4">{error}</div>
          <div className="text-sm">Make sure to run: npm run server</div>
        </div>
      </div>
    );
  }

  return (
    <ExamsContext.Provider value={{ exams, setExams: updateExams }}>
      <Router>
        <div className="w-full min-h-screen bg-neutral-200 dark:bg-stone-800 flex flex-col">
          <nav className="relative flex items-center justify-between px-4 sm:px-8 py-4 bg-white dark:bg-stone-800 border-b border-neutral-200 dark:border-stone-700 shadow-lg backdrop-blur">
            <div className="absolute left-4 sm:left-8">
              <span className="font-extrabold text-lg sm:text-xl tracking-wide text-gray-900 dark:text-white">Exam Manager</span>
            </div>
            <div className="flex-1 flex justify-center">
              <Navigation />
            </div>
            <div className="absolute right-4 sm:right-8">
              <ThemeToggle />
            </div>
          </nav>
          <main className="flex-1 flex items-center justify-center px-4">
            <div className="w-full max-w-4xl">
              <AnimatedRoutes />
            </div>
          </main>
        </div>
      </Router>
    </ExamsContext.Provider>
  );
}

export default App;
