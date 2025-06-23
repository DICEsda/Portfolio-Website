import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons'
import { FaSun, FaMoon } from 'react-icons/fa'

interface NavbarProps {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
}

const Navbar = ({ isMenuOpen, setIsMenuOpen }: NavbarProps) => {
  const { theme, toggleTheme } = useTheme()
  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className="fixed shadow-xl w-full z-50 bg-primary/90 dark:bg-dark-primary/90 backdrop-blur-sm">
      <div className="container-custom flex justify-between items-center h-16">
        <a href="#home" className="text-2xl font-bold text-secondary dark:text-dark-secondary ml-2">
          Portfolio
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            link.name === 'Contact' ? (
              <a
                key={link.name}
                href={link.href}
                className="bg-secondary text-primary dark:bg-dark-secondary dark:text-dark-primary px-4 py-1.5 rounded-md hover:bg-secondary/80 transition-colors text-sm font-bold"
              >
                {link.name}
              </a>
            ) : (
              <a
                key={link.name}
                href={link.href}
                className="text-light hover:text-secondary dark:text-dark-light dark:hover:text-dark-secondary transition-colors"
              >
                {link.name}
              </a>
            )
          ))}
        </div>

        {/* Theme Toggle Button */}
        <button onClick={toggleTheme} className="text-light dark:text-dark-light mr-2">
          {theme === 'light' ? <FaMoon /> : <FaSun />}
        </button>

        {/* Mobile Navigation Button */}
        <button
          className="md:hidden text-light dark:text-dark-light"
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
        <div className="md:hidden bg-primary/95 dark:bg-dark-primary/95 backdrop-blur-sm">
          <div className="container-custom py-4 space-y-4">
            {navLinks.map((link) => (
              link.name === 'Contact' ? (
                <a
                  key={link.name}
                  href={link.href}
                  className="block bg-secondary text-primary dark:bg-dark-secondary dark:text-dark-primary px-4 py-1.5 rounded-md hover:bg-secondary/80 transition-colors text-center text-sm font-bold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  className="block text-light hover:text-secondary dark:text-dark-light dark:hover:text-dark-secondary transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </a>
              )
            ))}
            <button onClick={toggleTheme} className="w-full text-light dark:text-dark-light flex justify-center py-2">
              {theme === 'light' ? <FaMoon size={20} /> : <FaSun size={20} />}
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar 