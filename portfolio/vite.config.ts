import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// Use GitHub Pages base path unless running on Vercel (or other generic host)
const isVercel = process.env.VERCEL === '1'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: isVercel ? '/' : '/Portfolio-Website/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          motion: ['framer-motion'],
          fullpage: ['fullpage.js'],
        }
      }
    }
  }
})
