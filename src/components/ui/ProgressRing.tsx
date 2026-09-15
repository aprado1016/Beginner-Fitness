import type { ReactNode } from 'react'

interface ProgressRingProps {
  progress: number // 0..1
  size?: number
  strokeWidth?: number
  children?: ReactNode
  trackClassName?: string
  progressClassName?: string
}

export function ProgressRing({
  progress,
  size = 64,
  strokeWidth = 6,
  children,
  trackClassName = 'stroke-neutral-quaternary',
  progressClassName = 'stroke-brand',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(1, Math.max(0, progress))
  const offset = circumference * (1 - clamped)

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={`${progressClassName} transition-[stroke-dashoffset] duration-500 ease-out`}
        />
      </svg>
      {children && <div className="absolute inset-0 flex items-center justify-center">{children}</div>}
    </div>
  )
}
