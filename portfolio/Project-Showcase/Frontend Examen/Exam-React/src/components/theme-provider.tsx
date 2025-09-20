import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(storageKey) as Theme
      console.log('Initial theme from localStorage:', stored)
      return stored || defaultTheme
    }
    return defaultTheme
  })

  useEffect(() => {
    const root = window.document.documentElement

    const applyTheme = () => {
      console.log('Applying theme:', theme)
      
      // Remove all theme classes first
      root.classList.remove("light", "dark")

      // Add the specific theme class
      root.classList.add(theme)
      
      console.log('HTML classes after applying theme:', root.classList.toString())
      console.log('localStorage theme:', localStorage.getItem('vite-ui-theme'))
      
      // Force a repaint
      root.style.display = 'none'
      root.offsetHeight // Trigger reflow
      root.style.display = ''
    }

    applyTheme()
  }, [theme])

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
      console.log('setTheme called with:', newTheme)
      localStorage.setItem(storageKey, newTheme)
      setTheme(newTheme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined) throw new Error("useTheme must be used within a ThemeProvider")

  return context
}