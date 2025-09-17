import { useEffect, useRef } from 'react'

type PagerOptions = {
  duration?: number
  offset?: number
}

export function useSectionPager(options: PagerOptions = {}) {
  const isAnimatingRef = useRef(false)
  const lastIntentRef = useRef<number>(0)

  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }
    const scrollEl = document.querySelector('main.scroll-container') as HTMLElement | null
    if (!scrollEl) return

    const getNavHeight = () => {
      const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'))
      return Number.isFinite(h) && h > 0 ? h : 64
    }

    const sections = () => Array.from(scrollEl.querySelectorAll(':scope > section')) as HTMLElement[]

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

    const animateTo = (targetTop: number, duration = options.duration ?? 550) => {
      const startTop = scrollEl.scrollTop
      const delta = targetTop - startTop
      if (Math.abs(delta) < 1) return Promise.resolve()
      isAnimatingRef.current = true
      const start = performance.now()
      return new Promise<void>((resolve) => {
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = easeOutCubic(t)
          scrollEl.scrollTop = startTop + delta * eased
          if (t < 1) {
            requestAnimationFrame(step)
          } else {
            // Ensure exact alignment
            scrollEl.scrollTop = Math.round(targetTop)
            isAnimatingRef.current = false
            resolve()
          }
        }
        requestAnimationFrame(step)
      })
    }

    const currentIndex = () => {
      const list = sections()
      const elRect = scrollEl.getBoundingClientRect()
      const nav = getNavHeight()
      let bestIdx = 0
      let bestDist = Infinity
      for (let i = 0; i < list.length; i++) {
        const s = list[i]
        const rect = s.getBoundingClientRect()
        const topInScroll = scrollEl.scrollTop + (rect.top - elRect.top) - nav
        const dist = Math.abs(topInScroll - scrollEl.scrollTop)
        if (dist < bestDist) {
          bestDist = dist
          bestIdx = i
        }
      }
      return bestIdx
    }

    const targetTopForIndex = (idx: number) => {
      const list = sections()
      const clamped = Math.max(0, Math.min(idx, list.length - 1))
      const el = list[clamped]
      const elRect = scrollEl.getBoundingClientRect()
      const nav = getNavHeight()
      const rect = el.getBoundingClientRect()
      const target = scrollEl.scrollTop + (rect.top - elRect.top) - nav
      return Math.max(0, Math.min(target, scrollEl.scrollHeight - scrollEl.clientHeight))
    }

    const snapTo = async (idx: number) => {
      const target = targetTopForIndex(idx)
      await animateTo(target)
    }

    const next = () => snapTo(currentIndex() + 1)
    const prev = () => snapTo(currentIndex() - 1)

    const canElementScrollY = (el: HTMLElement) => {
      const style = getComputedStyle(el)
      const overflowY = style.overflowY
      const isScrollableStyle = overflowY !== 'visible' && overflowY !== 'hidden'
      return isScrollableStyle && el.scrollHeight > el.clientHeight
    }

    const wheelHandler = (e: WheelEvent) => {
      // Allow native scroll inside inputs/textareas and any scrollable ancestor
      const target = e.target as HTMLElement
      const tag = (target.tagName || '').toLowerCase()
      if (tag === 'textarea' || tag === 'input' || tag === 'select') return
      let node: HTMLElement | null = target
      while (node && node !== scrollEl) {
        if (canElementScrollY(node)) return
        node = node.parentElement
      }

      const now = performance.now()
      if (isAnimatingRef.current || now - lastIntentRef.current < 200) { e.preventDefault(); return }
      const dy = e.deltaY
      if (Math.abs(dy) < 10) return
      e.preventDefault()
      lastIntentRef.current = now
      if (dy > 0) next(); else prev()
    }

    let touchStartY = 0
    let touchActive = false
    const onTouchStart = (e: TouchEvent) => {
      touchActive = true
      touchStartY = e.touches[0]?.clientY ?? 0
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!touchActive) return
      const dy = (e.touches[0]?.clientY ?? 0) - touchStartY
      if (Math.abs(dy) > 50) {
        e.preventDefault()
        touchActive = false
        if (dy < 0) next(); else prev()
      }
    }
    const onTouchEnd = () => { touchActive = false }

    const keyHandler = (e: KeyboardEvent) => {
      if (isAnimatingRef.current) { e.preventDefault(); return }
      switch (e.key) {
        case 'PageDown': e.preventDefault(); next(); break
        case 'PageUp': e.preventDefault(); prev(); break
        case 'ArrowDown': e.preventDefault(); next(); break
        case 'ArrowUp': e.preventDefault(); prev(); break
        case 'Home': e.preventDefault(); snapTo(0); break
        case 'End': e.preventDefault(); snapTo(sections().length - 1); break
      }
    }

    scrollEl.addEventListener('wheel', wheelHandler, { passive: false })
    scrollEl.addEventListener('touchstart', onTouchStart, { passive: true })
    scrollEl.addEventListener('touchmove', onTouchMove, { passive: false })
    scrollEl.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', keyHandler)

    return () => {
      scrollEl.removeEventListener('wheel', wheelHandler as any)
      scrollEl.removeEventListener('touchstart', onTouchStart as any)
      scrollEl.removeEventListener('touchmove', onTouchMove as any)
      scrollEl.removeEventListener('touchend', onTouchEnd as any)
      window.removeEventListener('keydown', keyHandler as any)
    }
  }, [options.duration, options.offset])
}
