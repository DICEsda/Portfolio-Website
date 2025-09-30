import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css';   // ✅ to apply Tailwind
import { ThemeProvider } from './context/ThemeContext.tsx'
import { LazyMotion, domAnimation } from 'framer-motion'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <LazyMotion features={domAnimation} strict>
        <App />
      </LazyMotion>
    </ThemeProvider>
  </React.StrictMode>,
)