import { useEffect, useState } from 'react'

export function usePageActive(anchor: string) {
  const [active, setActive] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as { index: number; anchor: string }
      if (!detail) return
      setActive(detail.anchor === anchor)
    }

    window.addEventListener('pageChange', handler)

    // Initialize from current hash if present
    const hash = window.location.hash.replace('#', '')
    setActive(hash ? hash === anchor : anchor === 'home')

    return () => {
      window.removeEventListener('pageChange', handler)
    }
  }, [anchor])

  return active
}
