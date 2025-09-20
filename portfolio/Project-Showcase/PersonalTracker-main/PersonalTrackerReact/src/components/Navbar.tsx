import { NavLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

const navItems = [
  { name: 'Dashboard', path: '/' },
  { name: 'Fitness', path: '/fitness' },
  { name: 'Mindfulness', path: '/mindfulness' },
  { name: 'Calendar', path: '/calendar' },
];

export function Navbar() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <nav className="w-full bg-stone-50 dark:bg-stone-900 text-stone-900 dark:text-stone-50 shadow-md sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-screen-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 rounded-full bg-stone-600 flex items-center justify-center text-stone-50 font-bold text-lg">PT</div>
          <div className="text-xl font-bold tracking-wide text-stone-900 dark:text-stone-50">Personal Tracker</div>
        </div>
        <div className="flex gap-6 items-center">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }: { isActive: boolean }) =>
                `relative px-4 py-1 rounded-full transition-all duration-200 font-medium outline-none focus:ring-2 focus:ring-stone-400/50 ` +
                (isActive
                  ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 shadow-md border border-stone-700 dark:border-stone-300'
                  : 'hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-200')
              }
              end={item.path === '/'}
            >
              <span className="z-10 relative">{item.name}</span>
              {/** Pill animation */}
              {/* Optionally, add an animated underline or pill here */}
            </NavLink>
          ))}
          {/* Dark mode toggle */}
          <button
            className="ml-4 p-2 rounded-full bg-stone-200 dark:bg-stone-700 hover:bg-stone-300 dark:hover:bg-stone-600 transition-colors duration-200"
            title="Toggle dark mode"
            onClick={() => setDarkMode((d) => !d)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0112 21.75c-5.385 0-9.75-4.365-9.75-9.75 0-4.07 2.44-7.57 6-9.09.38-.16.81-.03 1.04.31.23.34.18.8-.13 1.07A7.5 7.5 0 0012 19.5c2.485 0 4.71-1.23 6.09-3.25.27-.41.73-.46 1.07-.23.34.23.47.66.31 1.04z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71" /></svg>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
} 