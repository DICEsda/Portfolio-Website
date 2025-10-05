import { useEffect, useState } from 'react'
import { m, AnimatePresence } from 'framer-motion'
import { FaGithub, FaLinkedin, FaFacebook } from 'react-icons/fa'

const BottomPill = () => {
  const [isContact, setIsContact] = useState(false)

  useEffect(() => {
    const handler = (e: any) => {
      const anchor: string = e?.detail?.anchor || ''
      setIsContact(anchor === 'contact')
    }
    window.addEventListener('pageChange', handler)

    // Fallback when not using fullPage.js
    const contact = document.querySelector('#contact')
    let observer: IntersectionObserver | null = null
    if (contact) {
      observer = new IntersectionObserver(
        (entries) => entries.forEach((entry) => setIsContact(entry.isIntersecting)),
        { threshold: 0.6 }
      )
      observer.observe(contact)
    }

    return () => {
      window.removeEventListener('pageChange', handler)
      if (observer) observer.disconnect()
    }
  }, [])

  return (
    <div className="fixed bottom-3 left-0 right-0 z-40 flex justify-center pointer-events-none">
      <AnimatePresence mode="wait" initial={false}>
        {isContact ? (
          <m.div
            key="icons"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto flex items-center gap-5 bg-primary/60 backdrop-blur-xl backdrop-saturate-150 rounded-full px-6 py-2.5 shadow-xl ring-1 ring-white/10"
            aria-label="Social links"
          >
            <a
              href="https://github.com/DicesDa"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-secondary transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/jahye-ali-72267916b/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-secondary transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=100077495904298"
              target="_blank"
              rel="noopener noreferrer"
              className="text-tertiary hover:text-secondary transition-colors"
              aria-label="Facebook"
            >
              <FaFacebook className="w-5 h-5" />
            </a>
          </m.div>
        ) : (
          <m.p
            key="credit"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto text-tertiary/85 text-xs md:text-sm bg-primary/60 backdrop-blur-xl backdrop-saturate-150 rounded-full px-5 py-2 shadow-xl ring-1 ring-white/10"
          >
            Designed and created by <span className="font-medium text-secondary">Yahya Ali</span>
          </m.p>
        )}
      </AnimatePresence>
    </div>
  )
}

export default BottomPill
