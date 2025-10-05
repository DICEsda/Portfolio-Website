import { useEffect, useState, useRef } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import { useTheme } from './context/ThemeContext'
import ProgressTimeline from './components/ProgressTimeline'
import BottomPill from './components/BottomPill'
import LoadingOverlay from './components/LoadingOverlay'

function App() {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(true)
  const loaderHiddenRef = useRef(false)
  const MIN_DESKTOP_WIDTH = 1366
  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= MIN_DESKTOP_WIDTH : true)
  const fpRef = useRef<any>(null)

  // Track viewport width and toggle desktop gate
  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= MIN_DESKTOP_WIDTH
      setIsDesktop(desktop)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!isDesktop) {
      // If leaving desktop view, destroy fullPage instance and stop loader
      try { fpRef.current?.destroy?.('all') } catch { /* ignore */ }
      fpRef.current = null
      if (!loaderHiddenRef.current) {
        loaderHiddenRef.current = true
        setLoading(false)
      }
      return
    }

    // Already initialized on a previous desktop render
    if (fpRef.current) return

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

        // Fallback timer in case afterLoad never fires
        fallbackTimer = setTimeout(() => {
          if (!loaderHiddenRef.current) {
            loaderHiddenRef.current = true
            setLoading(false)
          }
        }, 1600)

        // Defer init to next frame so React has flushed full static content (no Suspense swaps)
        await new Promise(requestAnimationFrame)
        const mod = await import('fullpage.js')
        // @ts-ignore - handle dual export style
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
        fpRef.current = fp
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
      fpRef.current = null
    }
  }, [isDesktop])

  // Removed legacy scroll observers to avoid conflicts; animations are handled per-component.

  if (!isDesktop) {
    return (
      <div className={`${theme} bg-primary min-h-screen flex items-center justify-center p-6 text-center`}>        
        <div className="max-w-md space-y-4">
          <h1 className="text-2xl font-bold text-light">Desktop Version Only (Work in Progress)</h1>
          <p className="text-tertiary text-sm leading-relaxed">I'm currently optimizing the mobile experience. Please revisit on a laptop or desktop (≥ 1366px width) to view the portfolio.</p>
          <p className="text-tertiary text-xs opacity-70">Resize your window or rotate your device if possible.</p>
        </div>
      </div>
    )
  }

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
