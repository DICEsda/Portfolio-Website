import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa'

const Footer = () => {
  const [isAtLastSection, setIsAtLastSection] = useState(false)

  useEffect(() => {
    const contact = document.querySelector('#contact')
    if (!contact) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => setIsAtLastSection(entry.isIntersecting))
      },
      { threshold: 0.5 }
    )

    observer.observe(contact)
    return () => observer.disconnect()
  }, [])

  return (
    <footer className="fixed bottom-0 left-0 right-0 py-3 z-40 pointer-events-none">
      <div className="flex justify-center items-center">
        <AnimatePresence mode="wait" initial={false}>
          {isAtLastSection ? (
            <m.div
              key="socials"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex gap-6 bg-primary/70 backdrop-blur-md rounded-full px-5 py-2 shadow-md pointer-events-auto"
              aria-label="Social links"
            >
              <a
                href="https://github.com/DicesDa"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/70 hover:text-secondary transition-colors"
                aria-label="GitHub"
              >
                <FaGithub className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/Yahya-ali-72267916b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/70 hover:text-secondary transition-colors"
                aria-label="LinkedIn"
              >
                <FaLinkedin className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100077495904298"
                target="_blank"
                rel="noopener noreferrer"
                className="text-secondary/70 hover:text-secondary transition-colors"
                aria-label="Facebook"
              >
                <FaFacebook className="w-4 h-4" />
              </a>
            </m.div>
          ) : (
            <m.p
              key="credit"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="text-tertiary/80 text-xs md:text-sm bg-primary/70 backdrop-blur-md rounded-full px-4 py-1.5 shadow-md pointer-events-auto"
            >
              Designed and created by <span className="font-medium text-secondary">Yahya Ali</span>
            </m.p>
          )}
        </AnimatePresence>
      </div>
    </footer>
  )
}

export default Footer