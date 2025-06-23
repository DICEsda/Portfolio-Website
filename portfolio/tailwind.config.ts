/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  safelist: [
    'text-primary',
    'text-secondary', 
    'text-tertiary',
    'text-light',
    'bg-primary',
    'bg-secondary',
    'bg-tertiary',
    'bg-light',
    'bg-card',
    'border-primary',
    'border-secondary',
    'border-tertiary',
    'border-light',
    'dark:text-dark-primary',
    'dark:text-dark-secondary',
    'dark:text-dark-tertiary',
    'dark:text-dark-light',
    'dark:bg-dark-primary',
    'dark:bg-dark-secondary',
    'dark:bg-dark-tertiary',
    'dark:bg-dark-light',
    'dark:bg-dark-card',
    'dark:border-dark-primary',
    'dark:border-dark-secondary',
    'dark:border-dark-tertiary',
    'dark:border-dark-light'
  ],
  theme: {
    extend: {
      colors: {
        // Default colors (dark theme)
        primary: "#0a192f",
        secondary: "#ff9966",
        tertiary: "#8892b0",
        light: "#ccd6f6",
        card: "#112240",

        // Light mode variants
        "dark-primary": "#ffffff",
        "dark-secondary": "#ff9966",
        "dark-tertiary": "#555555",
        "dark-light": "#333333",
        "dark-card": "#f5f5f5"
      },
      maxWidth: {
        'custom': '1200px',
      },
      padding: {
        'section': '6rem 2rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
    container: {
      center: true,
      padding: "1rem",
    },
  },
  plugins: [],
};
