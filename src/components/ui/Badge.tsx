import type { HTMLAttributes, ReactNode } from 'react'
import { clsx } from '@/lib/clsx'

type Variant = 'brand' | 'neutral' | 'success' | 'warning' | 'danger'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant
  icon?: ReactNode
  children: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  brand: 'bg-brand-softer border-border-brand/40 text-fg-brand-strong',
  neutral: 'bg-neutral-secondary-medium border-border-default text-heading',
  success: 'bg-success-soft border-success-medium text-success-strong',
  warning: 'bg-warning-soft border-warning-medium text-warning-strong',
  danger: 'bg-danger-soft border-danger-medium text-danger-strong',
}

export function Badge({ variant = 'neutral', icon, children, className, ...rest }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-control border px-2.5 py-1 text-xs font-medium',
        VARIANT_CLASSES[variant],
        className,
      )}
      {...rest}
    >
      {icon}
      {children}
    </span>
  )
}
