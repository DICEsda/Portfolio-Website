/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0a192f",
        secondary: "#64ffda",
        tertiary: "#8892b0",
        light: "#ccd6f6",
      },
      maxWidth: {
        '7xl': '80rem',
      },
    },
  },
  plugins: [],
} 