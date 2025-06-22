import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const mainElement = document.querySelector('main')
    if (!mainElement) return

    let isScrolling = false

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const smoothScrollTo = (element: Element, target: number, duration: number) => {
      const start = element.scrollTop
      const change = target - start
      const startTime = performance.now()

      const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const easedProgress = easeInOutCubic(progress)
        
        element.scrollTop = start + change * easedProgress

        if (progress < 1) {
          requestAnimationFrame(animateScroll)
        } else {
          isScrolling = false
        }
      }

      requestAnimationFrame(animateScroll)
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      if (isScrolling) return
      
      isScrolling = true
      
      const currentScrollTop = mainElement.scrollTop
      const windowHeight = window.innerHeight
      const currentSection = Math.round(currentScrollTop / windowHeight)
      
      let targetSection: number
      
      if (e.deltaY > 0) {
        // Scrolling down
        targetSection = Math.min(currentSection + 1, 3) // 4 sections total (0-3)
      } else {
        // Scrolling up
        targetSection = Math.max(currentSection - 1, 0)
      }
      
      const targetScrollTop = targetSection * windowHeight
      
      // Use custom smooth scroll with softer easing
      smoothScrollTo(mainElement, targetScrollTop, 1500) // 1.5 seconds duration
    }

    mainElement.addEventListener('wheel', handleWheel, { passive: false })
    
    return () => {
      mainElement.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <div className="min-h-screen bg-primary">
      <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <main className="snap-y snap-mandatory h-screen overflow-y-scroll scroll-smooth">
        <div className="snap-start h-screen">
          <Hero />
        </div>
        <div className="snap-start h-screen">
          <About />
        </div>
        <div className="snap-start h-screen">
          <Projects />
        </div>
        <div className="snap-start h-screen">
          <Contact />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default App
