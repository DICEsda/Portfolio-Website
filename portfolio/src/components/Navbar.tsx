import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
import { m, AnimatePresence } from 'framer-motion'
// no smooth scroll needed with fullPage.js

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('home')
  const { theme, toggleTheme } = useTheme()
  // Track wide layout (e.g., >= 1280px) to disable sidebar transformation on large screens
  const [isWide, setIsWide] = useState(() => typeof window !== 'undefined' ? window.innerWidth >= 1280 : true)
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false
    try { return localStorage.getItem('sidebarCollapsed') === '1' } catch { return false }
  })

  useEffect(() => {
    const handler = (e: any) => {
      const anchor: string = e?.detail?.anchor || 'home'
      const index: number = e?.detail?.index || 0
      setActiveSection(anchor)
      setIsScrolled(index > 0)
    }
    window.addEventListener('pageChange', handler)
    return () => window.removeEventListener('pageChange', handler)
  }, [])

  // Listen for resize to switch between sidebar and topbar behavior at breakpoint (1280px ~ Tailwind xl)
  useEffect(() => {
    const onResize = () => setIsWide(window.innerWidth >= 1280)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  // Persist collapse state
  useEffect(() => {
    try { localStorage.setItem('sidebarCollapsed', sidebarCollapsed ? '1' : '0') } catch {}
  }, [sidebarCollapsed])

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isMenuOpen && !target.closest('nav')) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMenuOpen])

  const navItems = [
    { href: '#home', label: 'Home' },
    { href: '#about', label: 'About' },
    { href: '#projects', label: 'Projects' },
    { href: '#contact', label: 'Contact', isCTA: true },
  ]


  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault()
    const sectionId = href.replace('#', '')
    const api = (window as any).fullpage_api
    if (api) api.moveTo(sectionId)
    setIsMenuOpen(false)
  }

  // Sidebar should only appear after leaving home AND only when not wide
  const isSidebar = activeSection !== 'home' && !isWide
  const showTopDesktop = !isSidebar // if large screen, we keep top bar even when not on home

  return (
    <>
      {/* Desktop Top Navbar (only on home) */}
      <AnimatePresence>
        {showTopDesktop && (
          <m.nav
            key="top"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -30, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22,1,0.36,1] }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 hidden md:block ${
              isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
            }`}
          >
            <div className="container mx-auto px-4 max-w-7xl">
              <div className="flex items-center justify-between h-16 relative">
                <div className="flex-shrink-0">
                  <a href="#home" onClick={(e)=>handleNavClick(e,'#home')} className="text-2xl font-bold text-light hover:text-secondary transition-colors">YA</a>
                </div>
                <div className="flex items-center space-x-8 ml-auto">
                  {navItems.map(item => (
                    item.isCTA ? (
                      <a key={item.href} href={item.href} onClick={(e)=>handleNavClick(e,item.href)} className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-white shadow-md hover:bg-secondary/90 transition-colors font-semibold">{item.label}</a>
                    ) : (
                      <a key={item.href} href={item.href} onClick={(e)=>handleNavClick(e,item.href)} className={`relative text-tertiary hover:text-secondary transition-colors font-medium border-b-2 border-transparent ${activeSection === item.href.replace('#','') ? 'text-secondary border-secondary' : ''}`}>{item.label}</a>
                    )
                  ))}
                  <button onClick={toggleTheme} aria-label="Toggle theme" className="p-2 text-tertiary hover:text-secondary transition-colors rounded">
                    {theme === 'light' ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </m.nav>
        )}
      </AnimatePresence>

      {/* Sidebar (visible after leaving home on constrained widths) */}
      <AnimatePresence>
        {isSidebar && (
          <m.aside
            key="side"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 30, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}
            className={`hidden md:flex fixed top-1/2 -translate-y-1/2 right-2 lg:right-4 z-50 ${sidebarCollapsed ? 'w-16' : 'w-44'}`}
            aria-label="Section navigation sidebar"
          >
            <nav className={`bg-primary/80 backdrop-blur-xl border border-tertiary/20 rounded-2xl shadow-xl ${sidebarCollapsed ? 'p-2' : 'p-4'} flex flex-col items-stretch gap-3 w-full transition-[width,padding] duration-300`}>
              <div className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'} mb-2`}>
                <a href="#home" onClick={(e)=>handleNavClick(e,'#home')} className={`font-bold text-light hover:text-secondary transition-colors ${sidebarCollapsed ? 'text-base' : 'text-lg'}`}>YA</a>
                <div className={`flex items-center ${sidebarCollapsed ? 'hidden' : 'flex'} gap-1.5`}>
                  <button onClick={toggleTheme} aria-label="Toggle theme" className="p-1.5 text-tertiary hover:text-secondary transition-colors rounded">
                    {theme === 'light' ? (
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                    )}
                  </button>
                  <button onClick={()=>setSidebarCollapsed(c=>!c)} aria-label={sidebarCollapsed ? 'Expand navigation' : 'Collapse navigation'} className="p-1.5 text-tertiary hover:text-secondary transition-colors rounded">
                    {sidebarCollapsed ? (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                    ) : (
                      <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    )}
                  </button>
                </div>
                {/* Collapse toggle visible when collapsed */}
                {sidebarCollapsed && (
                  <button onClick={()=>setSidebarCollapsed(false)} aria-label="Expand navigation" className="absolute top-2 right-2 p-1 text-tertiary hover:text-secondary transition-colors rounded">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
                )}
              </div>
              <ul className={`flex flex-col ${sidebarCollapsed ? 'gap-1 items-center' : 'gap-1.5'} flex-1`}>
                {navItems.map(item => (
                  <li key={item.href} className="w-full">
                    <a
                      href={item.href}
                      onClick={(e)=>handleNavClick(e,item.href)}
                      className={`group flex ${sidebarCollapsed ? 'justify-center' : 'items-center justify-between'} w-full text-sm ${sidebarCollapsed ? 'px-2 py-2' : 'px-3 py-2'} rounded-lg transition-colors border border-transparent ${activeSection === item.href.replace('#','') ? 'bg-secondary/15 text-secondary border-secondary/30' : 'text-tertiary hover:text-secondary hover:bg-secondary/10'} ${item.isCTA ? 'font-semibold' : ''}`}
                    >
                      <span className={`${sidebarCollapsed ? 'sr-only' : ''}`}>{item.label}</span>
                      {activeSection === item.href.replace('#','') && (
                        <span className={`rounded-full bg-secondary shadow-sm ${sidebarCollapsed ? 'w-1.5 h-1.5' : 'w-2 h-2'}`} />
                      )}
                      {sidebarCollapsed && (
                        <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-tertiary/40 group-hover:bg-secondary/70 transition-colors" />
                      )}
                    </a>
                  </li>
                ))}
              </ul>
              {!sidebarCollapsed && (
                <div className="mt-auto pt-1 text-[10px] text-tertiary/60 text-center select-none">
                  nav
                </div>
              )}
            </nav>
          </m.aside>
        )}
      </AnimatePresence>

      {/* Mobile always uses original top nav pattern */}
      <nav className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-300 ${isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'}`}>
        <div className="px-4">
          <div className="flex items-center justify-between h-14 relative">
            <a href="#home" onClick={(e)=>handleNavClick(e,'#home')} className="text-xl font-bold text-light hover:text-secondary transition-colors">YA</a>
            <div className="flex items-center space-x-2.5">
              <button onClick={toggleTheme} aria-label="Toggle theme" className="p-3 text-tertiary hover:text-secondary transition-colors rounded">
                {theme === 'light' ? (
                  <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
                ) : (
                  <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" /></svg>
                )}
              </button>
              <button onClick={()=>setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu" className="p-3 text-tertiary hover:text-secondary transition-colors rounded">
                <svg className="w-5.5 h-5.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          {isMenuOpen && (
            <div className="bg-primary/95 backdrop-blur-sm border-t border-tertiary/20 shadow-lg">
              <div className="px-2 py-4 space-y-2">
                {navItems.map(item => (
                  <a key={item.href} href={item.href} onClick={(e)=>handleNavClick(e,item.href)} className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${item.isCTA ? 'bg-secondary text-white hover:bg-secondary/90' : 'text-tertiary hover:text-secondary hover:bg-secondary/10'}`}>{item.label}</a>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}

export default Navbar 