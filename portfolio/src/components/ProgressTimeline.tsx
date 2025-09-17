import { useEffect, useState } from 'react'
import { m } from 'framer-motion'

type Section = {
  id: string
  label: string
}

const sections: Section[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'contact', label: 'Contact' },
]

const ProgressTimeline = () => {
  const [active, setActive] = useState<string>('home')

  // Listen to global fullPage.js page changes
  useEffect(() => {
    const onPageChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as { index: number; anchor: string }
      if (!detail) return
      setActive(detail.anchor || sections[detail.index]?.id || 'home')
  // progress not required; follower uses active index directly
      // visited derived from index now; no explicit set
    }

    window.addEventListener('pageChange', onPageChange as EventListener)

    // Initialize based on current hash/anchor if present
    const hash = window.location.hash.replace('#', '')
    const initialIdx = Math.max(0, sections.findIndex(s => s.id === hash))
    setActive(hash || sections[initialIdx]?.id || 'home')
    // visited is derived from active index

    return () => {
      window.removeEventListener('pageChange', onPageChange as EventListener)
    }
  }, [])

  // No container scroll progress; computed via fullPage index

  const total = sections.length
  const activeIdx = Math.max(0, sections.findIndex(s => s.id === active))
  const fillPercent = (activeIdx / Math.max(1, total - 1)) * 100

  return (
    <div
      className="hidden md:block fixed left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative h-64 md:h-72 lg:h-80 w-4 flex items-center justify-center opacity-90">
        {/* Track */}
        <div className="absolute left-1/2 -translate-x-1/2 w-[2px] h-full bg-secondary/25 rounded" />

        {/* Fill to active (connect past/current circles) */}
        <m.div
          className="absolute left-1/2 -translate-x-1/2 w-[2px] bg-secondary rounded"
          style={{ top: 0 }}
          initial={{ height: 0 }}
          animate={{ height: `${fillPercent}%` }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        />

        {/* Dots: always visible, active larger */}
        {sections.map((s, idx) => {
          const dotPos = total > 1 ? idx / (total - 1) : 0
          const isActive = active === s.id
          const isPastOrCurrent = idx <= activeIdx
          const baseSize = 12 // px
          const activeSize = 16 // px
          const size = isActive ? activeSize : baseSize
          const ringClass = isActive ? 'shadow-[0_0_0_4px] shadow-secondary/25' : ''
          return (
            <div
              key={s.id}
              className="group absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              style={{ left: '50%', top: `${dotPos * 100}%` }}
              title={s.label}
            >
              <m.div
                className={`relative z-20 rounded-full bg-primary border border-secondary/40 ${ringClass}`}
                animate={{ width: size, height: size }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                style={{ width: size, height: size }}
              >
                <m.span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 block rounded-full bg-secondary"
                  initial={{ scale: 0 }}
                  animate={{ scale: isPastOrCurrent ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  style={{ width: Math.max(6, size - 6), height: Math.max(6, size - 6) }}
                />
              </m.div>
              <div
                className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 select-none"
                style={{ whiteSpace: 'nowrap' }}
              >
                <span className="px-2 py-0.5 text-xs bg-card text-light rounded shadow border border-tertiary/15">
                  {s.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ProgressTimeline
