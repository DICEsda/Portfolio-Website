import { useState, useEffect } from 'react'
import { useTheme } from '../context/ThemeContext'
// no smooth scroll needed with fullPage.js

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('home')
  const { theme, toggleTheme } = useTheme()

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

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-14 md:h-16 relative">
          {/* Subtle centered To‑do (desktop only) */}
          <div className="hidden md:flex absolute inset-0 items-center justify-center pointer-events-none">
            <span className="text-xs text-tertiary border border-tertiary bg-primary rounded-md px-2.5 py-0.5">
              To‑do: Galleries & live demos coming soon
            </span>
          </div>
          <div className="flex-shrink-0">
            <a href="#home" className="text-xl md:text-2xl font-bold text-light hover:text-secondary transition-colors">
              YA
            </a>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            {navItems.map((item) => (
              item.isCTA ? (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="inline-flex items-center px-4 py-2 rounded-lg bg-secondary text-white shadow-md hover:bg-secondary/90 transition-colors font-semibold"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`relative text-tertiary hover:text-secondary transition-colors font-medium border-b-2 border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-primary rounded ${activeSection === item.href.replace('#','') ? 'text-secondary border-secondary' : ''}`}
                >
                  {item.label}
                </a>
              )
            ))}
            <button
              onClick={toggleTheme}
              className="p-2 text-tertiary hover:text-secondary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-primary rounded"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-4.5 h-4.5 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-4.5 h-4.5 md:w-5 md:h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2.5">
            <button
              onClick={toggleTheme}
              className="p-3 text-tertiary hover:text-secondary transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-primary rounded"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              ) : (
                <svg className="w-5.5 h-5.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 text-tertiary hover:text-secondary transition-colors touch-manipulation focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary focus-visible:ring-offset-primary rounded"
              aria-label="Toggle menu"
            >
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

        {/* Mobile Navigation */}
  {isMenuOpen && (
          <div className="md:hidden bg-primary/95 backdrop-blur-sm border-t border-tertiary/20 shadow-lg">
            <div className="px-4 py-4 space-y-3">
              {navItems.map((item) => (
                item.isCTA ? (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block px-4 py-4 bg-secondary text-white rounded-lg font-medium hover:bg-secondary/90 transition-all duration-300 shadow-lg text-center touch-manipulation active:scale-95"
                  >
                    {item.label}
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={(e) => handleNavClick(e, item.href)}
                    className="block px-4 py-4 text-tertiary hover:text-secondary transition-colors font-medium touch-manipulation active:scale-95 border-b border-tertiary/10 last:border-b-0"
                  >
                    {item.label}
                  </a>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar 