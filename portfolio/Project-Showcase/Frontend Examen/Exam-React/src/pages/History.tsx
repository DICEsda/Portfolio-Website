import { useState, useContext } from 'react';
import { ExamsContext } from '../App';

export default function History() {
  const { exams } = useContext(ExamsContext);
  const [selectedExamId, setSelectedExamId] = useState('');

  const selectedExam = exams.find(exam => exam.id === selectedExamId);

  const avgGrade = selectedExam?.results && selectedExam.results.length > 0
    ? (selectedExam.results.reduce((sum, r) => sum + parseFloat(r.grade || '0'), 0) / selectedExam.results.length).toFixed(1)
    : 'N/A';

  // Calculate average time
  const avgTime = selectedExam?.results && selectedExam.results.length > 0
    ? Math.round(selectedExam.results.reduce((sum, r) => sum + r.duration, 0) / selectedExam.results.length)
    : 0;

  // Helper function to format time from seconds to MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 p-4 sm:p-6 lg:p-10 rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white tracking-wide">Exam History</h2>
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
                {exam.course} - {exam.term} ({exam.date})
              </option>
            ))}
          </select>
        </div>

        {selectedExam && (
          <>
            <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Average grade: <span className="text-emerald-200">{avgGrade}</span>
              </div>
              <div className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                Average time: <span className="text-emerald-200 font-mono">{formatTime(avgTime)}</span>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="hidden sm:block mt-6 sm:mt-8">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-neutral-200 dark:bg-stone-700">
                      <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold border-b border-neutral-200 dark:border-stone-700">Student</th>
                      <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold border-b border-neutral-200 dark:border-stone-700">Question</th>
                      <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold border-b border-neutral-200 dark:border-stone-700">Time Used</th>
                      <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold border-b border-neutral-200 dark:border-stone-700">Grade</th>
                      <th className="px-4 py-3 text-left text-gray-900 dark:text-white font-semibold border-b border-neutral-200 dark:border-stone-700">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedExam.results?.map((result, index) => (
                      <tr key={index} className="border-b border-neutral-200 dark:border-stone-700 hover:bg-neutral-200 dark:hover:bg-stone-700">
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{result.studentNumber}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white">{result.question}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-mono">{formatTime(result.duration)}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white font-bold">{result.grade}</td>
                        <td className="px-4 py-3 text-gray-900 dark:text-white max-w-xs truncate">{result.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile Cards */}
            <div className="sm:hidden mt-6 sm:mt-8 space-y-4">
              {selectedExam.results?.map((result, index) => (
                <div key={index} className="bg-neutral-200 dark:bg-stone-700 border border-neutral-200 dark:border-stone-700 p-4 rounded-xl">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold text-gray-900 dark:text-white">{result.studentNumber}</span>
                    <span className="font-bold text-gray-900 dark:text-white">{result.grade}</span>
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white mb-2">
                    <strong>Question:</strong> {result.question}
                  </div>
                  <div className="text-sm text-gray-900 dark:text-white mb-2">
                    <strong>Time:</strong> <span className="font-mono">{formatTime(result.duration)}</span>
                  </div>
                  {result.notes && (
                    <div className="text-sm text-gray-900 dark:text-white">
                      <strong>Notes:</strong> {result.notes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
} 