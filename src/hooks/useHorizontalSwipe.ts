import { useRef, type TouchEvent } from 'react'

const DISTANCE_THRESHOLD = 55
const DIRECTION_RATIO = 1.4

interface SwipeHandlers {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
}

/** Touch handlers for a simple horizontal swipe gesture, ignoring mostly-vertical drags (scrolling). */
export function useHorizontalSwipe({ onSwipeLeft, onSwipeRight }: SwipeHandlers) {
  const start = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = (e: TouchEvent) => {
    const t = e.touches[0]
    start.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: TouchEvent) => {
    const origin = start.current
    start.current = null
    if (!origin) return
    const t = e.changedTouches[0]
    const dx = t.clientX - origin.x
    const dy = t.clientY - origin.y
    if (Math.abs(dx) < DISTANCE_THRESHOLD) return
    if (Math.abs(dx) < Math.abs(dy) * DIRECTION_RATIO) return
    if (dx < 0) onSwipeLeft?.()
    else onSwipeRight?.()
  }

  return { onTouchStart, onTouchEnd }
}
