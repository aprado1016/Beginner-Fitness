import { clsx } from '@/lib/clsx'

interface SegmentedProgressBarProps {
  total: number
  completed: number
  className?: string
}

export function SegmentedProgressBar({ total, completed, className }: SegmentedProgressBarProps) {
  return (
    <div className={clsx('flex gap-1.5', className)} role="progressbar" aria-valuenow={completed} aria-valuemin={0} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={clsx(
            'h-1.5 flex-1 rounded-full transition-colors duration-300',
            i < completed ? 'bg-brand' : 'bg-neutral-quaternary',
          )}
        />
      ))}
    </div>
  )
}
