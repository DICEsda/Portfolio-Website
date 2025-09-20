import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  const handleToggle = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    
    if (newIsDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
    
    console.log("Theme toggled to:", newIsDark ? "dark" : "light")
  }

  // Initialize theme on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      setIsDark(true)
    } else {
      document.documentElement.classList.remove("dark")
      setIsDark(false)
    }
  }, [])

  return (
    <button
      onClick={handleToggle}
      className="relative rounded-full p-2 bg-neutral-200 dark:bg-stone-700 border border-neutral-200 dark:border-stone-700 hover:bg-neutral-300 dark:hover:bg-stone-600 transition-all duration-200"
      aria-label="Toggle theme"
    >
      <Sun
        className={`h-4 w-4 transition-all text-gray-900 dark:text-white ${isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
        aria-hidden={isDark}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <Moon
          className={`h-4 w-4 transition-all text-gray-900 dark:text-white ${!isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"}`}
          aria-hidden={!isDark}
        />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}