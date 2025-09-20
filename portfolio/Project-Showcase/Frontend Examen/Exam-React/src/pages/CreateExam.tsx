import { useState, useContext } from 'react';
import { ExamsContext } from '../App';
import { api } from '../api';

export default function CreateExam() {
  const { setExams } = useContext(ExamsContext);
  const [form, setForm] = useState({
    term: '',
    course: '',
    date: '',
    numQuestions: 1,
    duration: 60,
    startTime: '09:00'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'numQuestions' || name === 'duration' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newExam = await api.createExam({
        ...form,
        students: [],
        results: []
      });
      
      setExams(prev => [...prev, newExam]);
      
      // Reset form
      setForm({
        term: '',
        course: '',
        date: '',
        numQuestions: 1,
        duration: 60,
        startTime: '09:00'
      });
      
      alert('Exam created successfully!');
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert('Failed to create exam. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg my-8 sm:my-12">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white tracking-wide">Create Exam</h2>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Course</label>
          <input
            type="text"
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Term</label>
          <input
            type="text"
            name="term"
            value={form.term}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Date</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Number of Questions</label>
          <input
            type="number"
            name="numQuestions"
            value={form.numQuestions}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Duration (minutes)</label>
          <input
            type="number"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            min="1"
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Start Time</label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 sm:px-6 py-2 bg-emerald-200 text-gray-900 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] hover:bg-emerald-300 transform transition-all duration-200 ease-out active:scale-95 text-sm sm:text-base"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
} 