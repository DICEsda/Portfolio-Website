import { NavLink } from 'react-router-dom';

export default function Navigation() {
  return (
    <nav className="flex space-x-1 sm:space-x-2">
      <NavLink
        to="/"
        className={({ isActive }) =>
          `px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            isActive
              ? 'bg-emerald-200 text-gray-900 shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-stone-700'
          }`
        }
      >
        Create Exam
      </NavLink>
      <NavLink
        to="/add-students"
        className={({ isActive }) =>
          `px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            isActive
              ? 'bg-emerald-200 text-gray-900 shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-stone-700'
          }`
        }
      >
        Add Students
      </NavLink>
      <NavLink
        to="/start-exam"
        className={({ isActive }) =>
          `px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            isActive
              ? 'bg-emerald-200 text-gray-900 shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-stone-700'
          }`
        }
      >
        Start Exam
      </NavLink>
      <NavLink
        to="/history"
        className={({ isActive }) =>
          `px-3 sm:px-4 py-2 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 ${
            isActive
              ? 'bg-emerald-200 text-gray-900 shadow-md'
              : 'text-gray-900 dark:text-white hover:bg-neutral-200 dark:hover:bg-stone-700'
          }`
        }
      >
        History
      </NavLink>
    </nav>
  );
} 