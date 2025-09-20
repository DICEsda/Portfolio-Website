import { useState, useContext } from 'react';
import { ExamsContext } from '../App';
import { api } from '../api';

export default function AddStudents() {
  const { exams, setExams } = useContext(ExamsContext);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [student, setStudent] = useState({ name: '', studentNumber: '' });
  const [errors, setErrors] = useState({ name: '', studentNumber: '' });
  const [successMessage, setSuccessMessage] = useState('');

  const selectedExam = exams.find(exam => exam.id === selectedExamId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [name]: '' }));
    setSuccessMessage(''); // Clear success message when user types
    
    if (name === 'name') {
      // Only allow letters and spaces for name
      const lettersOnly = value.replace(/[^a-zA-Z\s]/g, '');
      setStudent(prev => ({ ...prev, [name]: lettersOnly }));
    } else if (name === 'studentNumber') {
      // Only allow non-negative numbers for student number
      const numbersOnly = value.replace(/[^0-9]/g, '');
      setStudent(prev => ({ ...prev, [name]: numbersOnly }));
    } else {
      setStudent(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = { name: '', studentNumber: '' };
    let isValid = true;

    if (!student.name.trim()) {
      newErrors.name = 'Student name is required';
      isValid = false;
    }

    if (!student.studentNumber.trim()) {
      newErrors.studentNumber = 'Student number is required';
      isValid = false;
    } else if (parseInt(student.studentNumber) < 0) {
      newErrors.studentNumber = 'Student number must be non-negative';
      isValid = false;
    }

    // Check for duplicate student number
    if (selectedExam && selectedExam.students.some(s => s.studentNumber === student.studentNumber)) {
      newErrors.studentNumber = 'A student with this number already exists in this exam';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedExamId) {
      alert('Please select an exam first.');
      return;
    }

    if (!validateForm()) {
      return; // Don't show alert, errors are already displayed
    }

    try {
      const updatedExam = await api.addStudentToExam(selectedExamId, student);
      
      setExams(prev => 
        prev.map(exam => 
          exam.id === selectedExamId ? updatedExam : exam
        )
      );
      
      // Show success message
      setSuccessMessage(`Student ${student.name} (${student.studentNumber}) added successfully!`);
      
      // Clear form
      setStudent({ name: '', studentNumber: '' });
      setErrors({ name: '', studentNumber: '' });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add student:', error);
      alert('Failed to add student. Please try again.');
    }
  };

  const handleRemove = async (studentNumber: string) => {
    if (!selectedExamId) return;

    try {
      const updatedExam = await api.removeStudentFromExam(selectedExamId, studentNumber);
      
      setExams(prev => 
        prev.map(exam => 
          exam.id === selectedExamId ? updatedExam : exam
        )
      );
      
      setSuccessMessage('Student removed successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to remove student:', error);
      alert('Failed to remove student. Please try again.');
    }
  };

  return (
    <div className="w-full max-w-[596px] mx-auto bg-white dark:bg-stone-800 border border-neutral-200 dark:border-stone-700 p-6 sm:p-8 lg:p-12 rounded-2xl shadow-lg">
      <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 sm:mb-8 text-gray-900 dark:text-white tracking-wide">Add Students</h2>
      
      {successMessage && (
        <div className="mb-4 p-3 bg-emerald-200 border border-emerald-300 rounded-xl text-gray-900 font-semibold">
          {successMessage}
        </div>
      )}
      
      <div className="space-y-4 sm:space-y-6">
        <div>
          <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Select Exam</label>
          <select
            value={selectedExamId}
            onChange={e => {
              setSelectedExamId(e.target.value);
              setSuccessMessage(''); // Clear success message when changing exam
            }}
            className="w-full px-3 sm:px-4 py-2 rounded-xl border border-neutral-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-200 focus:outline-none text-sm sm:text-base"
          >
            <option value="">Select an exam...</option>
            {exams.map(exam => (
              <option key={exam.id} value={exam.id}>
                {exam.course} - {exam.term} ({exam.students.length} students)
              </option>
            ))}
          </select>
        </div>
        
        {selectedExam && (
          <div className="bg-neutral-200 dark:bg-stone-700 p-3 rounded-xl">
            <p className="text-gray-900 dark:text-white text-sm">
              <strong>Selected Exam:</strong> {selectedExam.course} - {selectedExam.term}
            </p>
            <p className="text-gray-900 dark:text-white text-sm">
              <strong>Current Students:</strong> {selectedExam.students.length}
            </p>
          </div>
        )}
        
        <form onSubmit={handleAdd} className="space-y-4 mb-6">
          <div>
            <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Student Name *</label>
            <input 
              name="name" 
              value={student.name} 
              onChange={handleChange} 
              placeholder="Enter student name (letters only)" 
              required 
              className={`w-full px-3 sm:px-4 py-2 rounded-xl border ${
                errors.name 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-neutral-200 dark:border-stone-700 focus:ring-emerald-200'
              } bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:outline-none text-sm sm:text-base`} 
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>
          <div>
            <label className="block text-gray-900 dark:text-white mb-2 font-semibold text-sm sm:text-base">Student Number *</label>
            <input 
              name="studentNumber" 
              value={student.studentNumber} 
              onChange={handleChange} 
              placeholder="Enter student number (numbers only)" 
              required 
              className={`w-full px-3 sm:px-4 py-2 rounded-xl border ${
                errors.studentNumber 
                  ? 'border-red-400 focus:ring-red-400' 
                  : 'border-neutral-200 dark:border-stone-700 focus:ring-emerald-200'
              } bg-white dark:bg-stone-800 text-gray-900 dark:text-white focus:outline-none text-sm sm:text-base`} 
            />
            {errors.studentNumber && (
              <p className="text-red-400 text-xs mt-1">{errors.studentNumber}</p>
            )}
          </div>
          <button 
            type="submit" 
            disabled={!selectedExamId}
            className={`w-full px-4 sm:px-6 py-2 rounded-full font-bold shadow-md hover:shadow-lg hover:scale-[1.02] transform transition-all duration-200 ease-out active:scale-95 text-sm sm:text-base ${
              selectedExamId 
                ? 'bg-emerald-200 text-gray-900 hover:bg-emerald-300' 
                : 'bg-neutral-400 text-white cursor-not-allowed'
            }`}
          >
            Add Student
          </button>
        </form>
        
        {selectedExam && selectedExam.students.length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">Current Students ({selectedExam.students.length})</h3>
            <ul className="space-y-3">
              {selectedExam.students.map((s, i) => (
                <li key={i} className="flex justify-between items-center bg-emerald-200 border border-neutral-200 dark:border-stone-700 px-3 sm:px-6 py-3 rounded-xl">
                  <span className="text-gray-900 font-semibold text-sm sm:text-base">{s.name} ({s.studentNumber})</span>
                  <button 
                    onClick={() => handleRemove(s.studentNumber)} 
                    className="text-red-400 hover:text-red-600 hover:scale-110 transform transition-all duration-200 ease-out active:scale-90"
                    title="Remove student"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {selectedExam && selectedExam.students.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            <p>No students added to this exam yet.</p>
            <p className="text-sm mt-1">Add students using the form above.</p>
          </div>
        )}
      </div>
    </div>
  );
} 