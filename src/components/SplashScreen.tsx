import { motion } from 'framer-motion'
import { DumbbellIcon } from '@/components/icons'

// Rendered inside an <AnimatePresence> in App — when the parent stops rendering this,
// AnimatePresence plays `exit` before actually removing it from the DOM.
export function SplashScreen() {
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
      style={{ background: 'var(--page-bg)' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeInOut' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.45, ease: [0.34, 1.56, 0.64, 1] }}
        className="flex flex-col items-center"
      >
        <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-brand shadow-lg">
          <DumbbellIcon className="h-10 w-10 text-white" />
        </div>
        <motion.p
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.35 }}
          className="mt-4 text-lg font-semibold text-heading"
        >
          Maggie's Fitness
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
