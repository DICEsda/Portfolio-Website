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
    const observers: IntersectionObserver[] = []

    const callback: IntersectionObserverCallback = (entries) => {
      // Pick the section with the highest intersection ratio that's intersecting
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))

      if (visible.length > 0) {
        const id = (visible[0].target as HTMLElement).id
        if (id && id !== active) setActive(id)
      } else {
        // Fallback based on viewport position if none intersect (rare)
        const candidates = sections
          .map((s) => document.getElementById(s.id))
          .filter(Boolean) as HTMLElement[]
        const mid = window.innerHeight / 2
        let candidateId: string | null = null
        let closestDist = Number.POSITIVE_INFINITY
        candidates.forEach((el) => {
          const rect = el.getBoundingClientRect()
          const dist = Math.abs(rect.top - mid)
          if (dist < closestDist) {
            closestDist = dist
            candidateId = el.id
          }
        })
        if (candidateId && candidateId !== active) setActive(candidateId)
      }
    }

    const options: IntersectionObserverInit = {
      root: null,
      threshold: [0.2, 0.5, 0.8],
      rootMargin: '-10% 0px -10% 0px',
    }

    sections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (!el) return
      const observer = new IntersectionObserver(callback, options)
      observer.observe(el)
      observers.push(observer)
    })

    return () => observers.forEach((o) => o.disconnect())
  }, [active])

  // Global scroll progress for fill line
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollTop = window.scrollY || doc.scrollTop || 0
      const max = Math.max(1, doc.scrollHeight - window.innerHeight)
      const ratio = Math.min(1, Math.max(0, scrollTop / max))
      setProgress(ratio)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
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
      <div className="relative h-64 md:h-72 lg:h-80 w-6 flex items-center justify-center opacity-90">
        {/* Track */}
        <div className="absolute left-1/2 -translate-x-1/2 w-px h-full bg-tertiary/25 rounded" />
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
          const baseSize = isLast ? 14 : 10 // px
          const activeSize = isLast ? 20 : 14 // px
          const size = isActive ? activeSize : baseSize
          const isActiveLast = isActive && isLast && s.id === lastId
          const bgClass = (isFilled || isActiveLast) ? 'bg-secondary' : 'bg-tertiary/40'
          const ringClass = isActive ? 'shadow-[0_0_0_4px] shadow-secondary/20' : ''
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
