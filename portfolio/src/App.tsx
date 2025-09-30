import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
// Explicit extension helps with bundler module resolution in strict setups
import Contact from './components/Contact.tsx'
import { useTheme } from './context/ThemeContext'
import ProgressTimeline from './components/ProgressTimeline'
import BottomPill from './components/BottomPill'
import LoadingOverlay from './components/LoadingOverlay'

function App() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const loaderHiddenRef = useRef(false)

  useEffect(() => {
    let fp: any = null
    let fallbackTimer: any = null

    const start = async () => {
      try {
        const el = document.querySelector('#fullpage') as HTMLElement | null
        if (!el) {
          // If container is missing, fail open (hide loader) after short delay
          fallbackTimer = setTimeout(() => setLoading(false), 600)
          return
        }

        // Start a fallback timer in case fullpage afterLoad never fires
        fallbackTimer = setTimeout(() => {
          if (!loaderHiddenRef.current) {
            loaderHiddenRef.current = true
            setLoading(false)
          }
        }, 1500)

  const mod = await import('fullpage.js')
        // @ts-ignore - library may export default or function  
        const FullPage = mod.default || mod

        // eslint-disable-next-line new-cap
        fp = new FullPage('#fullpage', {
          licenseKey: 'gplv3-license',
          sectionSelector: '.section',
          anchors: ['home','about','projects','contact'],
          navigation: false,
          scrollingSpeed: 700,
          fitToSection: true,
          fitToSectionDelay: 200,
          keyboardScrolling: true,
          animateAnchor: true,
          recordHistory: false,
          css3: true,
          easingcss3: 'ease-out',
          touchSensitivity: 10,
          normalScrollElements: '[data-allow-native-scroll]',
          credits: { enabled: false },
          afterLoad: (_origin: any, destination: any) => {
            try {
              const idx = destination?.index ?? 0
              const anchor = destination?.anchor ?? ''
              window.dispatchEvent(new CustomEvent('pageChange', { detail: { index: idx, anchor } }))
              if (!loaderHiddenRef.current) {
                loaderHiddenRef.current = true
                setTimeout(() => setLoading(false), 40)
              }
            } catch {}
          }
        })
      } catch (err) {
        // On any init error, fail open by hiding loader soon
        if (!loaderHiddenRef.current) {
          loaderHiddenRef.current = true
          setTimeout(() => setLoading(false), 200)
        }
        console.error('fullPage init failed', err)
      }
    }

    start()

    return () => {
      try { fp?.destroy?.('all') } catch { /* ignore */ }
      if (fallbackTimer) clearTimeout(fallbackTimer)
    }
  }, [])

  // Removed legacy scroll observers to avoid conflicts; animations are handled per-component.

  return (
    <div className={`${theme} bg-primary min-h-screen`}>
  <LoadingOverlay visible={loading} />
  <ProgressTimeline />
      <Navbar />
      <div id="fullpage">
        <div className="section"><Hero /></div>
        <div className="section"><About /></div>
        <div className="section"><Projects /></div>
        <div className="section"><Contact /></div>
      </div>
      <BottomPill />
    </div>
  )
}

export default App
