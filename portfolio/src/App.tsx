import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { useTheme } from './context/ThemeContext'
import ProgressTimeline from './components/ProgressTimeline'

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    // Add observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view')
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px'
      }
    )

    // Observe all elements with scroll-animate class
    document.querySelectorAll('.scroll-animate').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (!mainElement) return

    const handleScroll = () => {
      const sections = mainElement.querySelectorAll('section')
      sections.forEach((section) => {
        const rect = section.getBoundingClientRect()
        if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
          section.classList.add('in-view')
        }
      })
    }

    mainElement.addEventListener('scroll', handleScroll, { passive: true })
    // Initial check
    handleScroll()

    return () => {
      mainElement.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={`${theme} bg-primary min-h-screen`}>
      <ProgressTimeline />
      <main className="scroll-container">
        <Navbar />
        <Hero />
        <About />
        <Projects />
        <Contact />
        <Footer />
      </main>
    </div>
  )
}

export default App
