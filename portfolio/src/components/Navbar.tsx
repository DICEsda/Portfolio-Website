import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'

interface NavbarProps {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed shadow-xl w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-primary/90  backdrop-blur-sm' : 'bg-transparent'
    }`}>
      <div className="container-custom flex justify-between items-center h-16">
        <a href="#home" className="text-2xl font-bold text-secondary ml-2">
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 mr-4">
          {navLinks.map((link) => (
            link.name === 'Contact' ? (
              <a
                key={link.name}
                href={link.href}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-sm"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-light hover:text-secondary transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-light"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <FontAwesomeIcon 
            icon={isMenuOpen ? faTimes : faBars} 
            className="w-6 h-6"
          />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-primary/95 backdrop-blur-sm">
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link) => (
              link.name === 'Contact' ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block bg-blue-600 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition-colors text-center text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-light hover:text-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 