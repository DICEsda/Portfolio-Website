/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: "#FFFFFF",
        secondary: "#ff9966",
        tertiary: "#555555",
        light: "#333333",
        card: "#F5F5F5",

        "dark-primary": "#0a192f",
        "dark-secondary": "#ff9966",
        "dark-tertiary": "#8892b0",
        "dark-light": "#ccd6f6",
        "dark-card": "#112240"
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
  },
  plugins: [],
}
