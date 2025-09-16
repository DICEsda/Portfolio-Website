import { useEffect, useState } from 'react'

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
  const [progress, setProgress] = useState<number>(0)

  useEffect(() => {
    const scrollEl = document.querySelector('main.scroll-container') as HTMLElement | null
    let ticking = false
    const computeActive = () => {
      const viewportH = scrollEl ? scrollEl.clientHeight : window.innerHeight
      const mid = viewportH / 2
      let next: string | null = null
      for (const s of sections) {
        const el = document.getElementById(s.id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const bottom = rect.top + rect.height
        if (rect.top <= mid && bottom >= mid) {
          next = s.id
          break
        }
      }
      if (!next) {
        // Fallback to closest
        let closest = Number.POSITIVE_INFINITY
        for (const s of sections) {
          const el = document.getElementById(s.id)
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const dist = Math.abs(rect.top - mid)
          if (dist < closest) {
            closest = dist
            next = s.id
          }
        }
      }
      const scrollTop = scrollEl ? scrollEl.scrollTop : window.scrollY
      if ((scrollTop || 0) < 10) next = 'home'
      if (next && next !== active) setActive(next)
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          computeActive()
          ticking = false
        })
        ticking = true
      }
    }

    computeActive()
    if (scrollEl) scrollEl.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (scrollEl) scrollEl.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Global scroll progress for fill line
  useEffect(() => {
    const scrollEl = document.querySelector('main.scroll-container') as HTMLElement | null
    const onScroll = () => {
      const el = scrollEl
      if (!el) return
      const scrollTop = el.scrollTop
      const max = Math.max(1, el.scrollHeight - el.clientHeight)
      const ratio = Math.min(1, Math.max(0, scrollTop / max))
      setProgress(ratio)
    }

    onScroll()
    if (scrollEl) scrollEl.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (scrollEl) scrollEl.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const total = sections.length
  const lastId = sections[total - 1]?.id

  return (
    <div
      className="hidden md:block fixed left-6 md:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-30 pointer-events-none"
      aria-hidden="true"
    >
      <div className="relative h-64 md:h-72 lg:h-80 w-4 flex items-center justify-center opacity-90">
        {/* Track */}
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-secondary/20 rounded" />
        {/* Fill */}
        <div
          className="absolute left-1/2 -translate-x-1/2 w-px bg-secondary rounded"
          style={{ height: `${progress * 100}%`, top: 0 }}
        />
        {/* Dots */}
        {sections.map((s, idx) => {
          const dotPos = total > 1 ? idx / (total - 1) : 0
          const isActive = active === s.id
          const isFilled = progress >= dotPos - 0.001
          const isLast = idx === total - 1
          const baseSize = isLast ? 12 : 8 // px
          const activeSize = isLast ? 16 : 12 // px
          const size = isActive ? activeSize : baseSize
          const isActiveLast = isActive && isLast && s.id === lastId
          const bgClass = (isFilled || isActiveLast) ? 'bg-secondary' : 'bg-secondary/40'
          const ringClass = isActive ? 'shadow-[0_0_0_3px] shadow-secondary/20' : ''
          return (
            <div
              key={s.id}
              className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${bgClass} ${ringClass}`}
              style={{
                left: '50%',
                top: `${dotPos * 100}%`,
                width: size,
                height: size,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}

export default ProgressTimeline
