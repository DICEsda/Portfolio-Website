import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExamsContext, type ExamResult } from '../App';
import { api } from '../api';

// Circular Countdown Dial Component
const CountdownDial = ({ timeLeft, totalTime }: { timeLeft: number; totalTime: number }) => {
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / totalTime;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="transform -rotate-90 w-24 h-24 sm:w-32 sm:h-32" viewBox="0 0 128 128">
        {/* Background circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          className="text-stone-200 dark:text-stone-500"
        />
        {/* Progress circle */}
        <circle
          cx="64"
          cy="64"
          r={radius}
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`transition-all duration-1000 ease-linear ${
            progress > 0.5 ? 'text-emerald-600' : progress > 0.25 ? 'text-yellow-500' : 'text-red-500'
          }`}
        />
      </svg>
      {/* Time display in center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-lg sm:text-2xl font-mono font-bold text-gray-900 dark:text-white">
          {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400">
          remaining
        </div>
      </div>
    </div>
  );
};

export default function StartExam() {
  const navigate = useNavigate();
  const { exams, setExams } = useContext(ExamsContext);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [studentIndex, setStudentIndex] = useState(0);
  const [question, setQuestion] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState('');
  const [grade, setGrade] = useState('');
  const [results, setResults] = useState<ExamResult[]>([]);

  const selectedExam = exams.find(exam => exam.id === selectedExamId);
  const student = selectedExam?.students[studentIndex];

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval: number;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const handleDrawQuestion = () => {
    if (!selectedExam) return;
    const questionNumber = Math.floor(Math.random() * selectedExam.numQuestions) + 1;
    setQuestion(`Question ${questionNumber}`);
  };

  const handleStartTimer = () => {
    if (!selectedExam) return;
    // Convert exam duration from minutes to seconds and set as countdown
    const durationInSeconds = selectedExam.duration * 60;
    setTimeLeft(durationInSeconds);
    setIsRunning(true);
  };

  const handleStopTimer = () => {
    setIsRunning(false);
  };

  const handleSave = async () => {
    if (!selectedExam || !student) return;

    // Calculate actual time used (duration - timeLeft)
    const timeUsed = (selectedExam.duration * 60) - timeLeft;

    const result: ExamResult = {
      studentNumber: student.studentNumber,
      question,
      duration: timeUsed,
      notes,
      grade
    };

    const newResults = [...results, result];
    setResults(newResults);

    try {
      const updatedExam = await api.updateExamResults(selectedExamId, newResults);
      
      setExams(prev => 
        prev.map(exam => 
          exam.id === selectedExamId ? updatedExam : exam
        )
      );

      // Reset form
      setQuestion('');
      setTimeLeft(0);
      setIsRunning(false);
      setNotes('');
      setGrade('');
    } catch (error) {
      console.error('Failed to save result:', error);
      alert('Failed to save result. Please try again.');
    }
  };

  const handleNextStudent = () => {
    if (!selectedExam) return;
    
    // Check if this is the last student
    if (studentIndex >= selectedExam.students.length - 1) {
      // Show "Exam Finished" notification
      alert('Exam Finished! All students have been processed.');
      // Navigate to History tab
      navigate('/history');
      return;
    }
    
    // Move to next student
    setStudentIndex(prev => prev + 1);
    setQuestion('');
    setTimeLeft(0);
    setIsRunning(false);
    setNotes('');
    setGrade('');
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 p-4 sm:p-6 lg:p-10 rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white tracking-wide">Start Exam</h2>
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Select Exam</label>
          <select
            value={selectedExamId}
            onChange={e => setSelectedExamId(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          >
            <option value="">Select an exam...</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.course} - {exam.term} ({exam.duration} min)
              </option>
            ))}
          </select>
        </div>

        {student ? (
          <>
            <div className="text-gray-900 dark:text-white font-semibold text-sm sm:text-base">
              Student: <span className="font-bold">{student.name}</span> ({student.studentNumber})
              {selectedExam && (
                <span className="text-gray-600 dark:text-gray-400 ml-2">
                  ({studentIndex + 1} of {selectedExam.students.length})
                </span>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-start gap-4 mt-6">
              <button onClick={handleDrawQuestion} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-emerald-200 text-gray-900 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-emerald-300 transform transition-all duration-200 ease-out active:scale-95 text-sm sm:text-base">Draw Question</button>
              {question && <span className="text-base sm:text-lg text-gray-900 dark:text-white">Question: {question}</span>}
            </div>
            
            {/* Countdown Dial Section */}
            <div className="flex flex-col items-center gap-4 mt-6 p-4 sm:p-6 bg-neutral-200 dark:bg-stone-700 rounded-xl">
              {selectedExam && timeLeft > 0 && (
                <CountdownDial 
                  timeLeft={timeLeft} 
                  totalTime={selectedExam.duration * 60} 
                />
              )}
              {timeLeft === 0 && selectedExam && !isRunning && (
                <div className="text-center">
                  <div className="text-2xl sm:text-4xl font-mono font-bold text-red-400 mb-2">
                    TIME'S UP!
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Total time: {formatTime(selectedExam.duration * 60)}
                  </div>
                </div>
              )}
              {timeLeft === 0 && !selectedExam && (
                <div className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Select an exam and start the timer
                </div>
              )}
              {selectedExam && timeLeft === 0 && isRunning && (
                <div className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  Timer is running...
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={handleStartTimer} 
                  disabled={isRunning || !selectedExam}
                  className="px-4 sm:px-6 py-2 bg-emerald-200 text-gray-900 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-emerald-300 transform transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Start Timer
                </button>
                <button 
                  onClick={handleStopTimer} 
                  disabled={!isRunning}
                  className="px-4 sm:px-6 py-2 bg-red-400 text-white rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-red-500 transform transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  Stop Timer
                </button>
              </div>
              
              {selectedExam && (
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                  Total exam time: {formatTime(selectedExam.duration * 60)}
                </div>
              )}
            </div>
            
            <div className="mt-6">
              <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Notes</label>
              <textarea value={notes} onChange={e => setNotes(e.target.value)} className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base" rows={3} />
            </div>
            <div className="mt-6">
              <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Grade</label>
              <select 
                value={grade} 
                onChange={e => setGrade(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
              >
                <option value="">Select grade...</option>
                <option value="12">12 - Excellent</option>
                <option value="10">10 - Very Good</option>
                <option value="7">7 - Good</option>
                <option value="4">4 - Fair</option>
                <option value="02">02 - Adequate</option>
                <option value="00">00 - Inadequate</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row justify-start gap-4 mt-8">
              <button onClick={handleSave} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-emerald-200 text-gray-900 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-emerald-300 transform transition-all duration-200 ease-out active:scale-95 text-sm sm:text-base">Save</button>
              <button onClick={handleNextStudent} className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-emerald-200 text-gray-900 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-emerald-300 transform transition-all duration-200 ease-out active:scale-95 text-sm sm:text-base">
                {selectedExam && studentIndex >= selectedExam.students.length - 1 ? 'Finish Exam' : 'Next Student'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-gray-900 dark:text-white text-sm sm:text-base">No students in this exam.</div>
        )}
      </div>
    </div>
  );
} 