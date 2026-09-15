import { useState } from 'react'
import { MinusIcon, PlusIcon } from '@/components/icons'
import { clsx } from '@/lib/clsx'

interface QuickAdjustChipProps {
  value: number
  step: number
  min?: number
  max?: number
  onChange: (value: number) => void
  formatValue: (value: number) => string
  ariaLabel: string
}

/** Tap to reveal a -/+ stepper inline — no separate edit screen. */
export function QuickAdjustChip({ value, step, min = 0, max = 999, onChange, formatValue, ariaLabel }: QuickAdjustChipProps) {
  const [expanded, setExpanded] = useState(false)

  if (!expanded) {
    return (
      <button
        type="button"
        onClick={() => setExpanded(true)}
        aria-label={`${ariaLabel}: ${formatValue(value)}. Tap to adjust.`}
        className="min-h-11 rounded-full border border-border-default-medium bg-neutral-secondary-medium px-3.5 text-sm font-medium text-body transition-colors hover:bg-neutral-tertiary-medium hover:text-heading"
      >
        {formatValue(value)}
      </button>
    )
  }

  return (
    <div className="animate-pop inline-flex items-center gap-1 rounded-full border border-border-brand bg-brand-softer p-1">
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        onClick={() => onChange(Math.max(min, value - step))}
        className={clsx(
          'flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-fg-brand-strong transition-transform active:scale-90 dark:bg-white/10',
        )}
      >
        <MinusIcon className="h-4 w-4" />
      </button>
      <span className="min-w-[3.5ch] text-center text-sm font-semibold tabular-nums text-fg-brand-strong">
        {formatValue(value)}
      </span>
      <button
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        onClick={() => onChange(Math.min(max, value + step))}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/70 text-fg-brand-strong transition-transform active:scale-90 dark:bg-white/10"
      >
        <PlusIcon className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => setExpanded(false)}
        className="ml-0.5 min-h-9 rounded-full bg-brand px-3 text-xs font-semibold text-white"
      >
        Done
      </button>
    </div>
  )
}
