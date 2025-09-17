import { m, AnimatePresence } from 'framer-motion'

type LoadingOverlayProps = {
  visible: boolean
}

const dotTransition = {
  repeat: Infinity,
  repeatType: 'loop' as const,
  duration: 0.9,
  ease: [0.4, 0.0, 0.2, 1.0] as [number, number, number, number],
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  return (
    <AnimatePresence>
      {visible && (
        <m.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          aria-label="Loading"
        >
          <div className="flex items-end gap-2">
            {[0, 1, 2].map((i) => (
              <m.span
                key={i}
                className="block rounded-full"
                style={{ width: 10, height: 10, backgroundColor: 'var(--color-secondary)' }}
                animate={{ y: [0, -8, 0], opacity: [1, 0.7, 1] }}
                transition={{ ...dotTransition, delay: i * 0.12 }}
              />)
            )}
          </div>
        </m.div>
      )}
    </AnimatePresence>
  )
}
