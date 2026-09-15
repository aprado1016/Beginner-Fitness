import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from 'react'
import { clsx } from '@/lib/clsx'

interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const PADDING = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
}

export function GlassCard({ children, padding = 'md', className, ...rest }: GlassCardProps) {
  return (
    <div
      className={clsx(
        'glass-edges relative rounded-base border border-glass bg-glass shadow-glass backdrop-blur-glass',
        PADDING[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

interface InteractiveGlassCardProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function InteractiveGlassCard({ children, padding = 'md', className, ...rest }: InteractiveGlassCardProps) {
  return (
    <button
      type="button"
      className={clsx(
        'glass-edges relative w-full rounded-base border border-glass bg-glass text-left shadow-glass backdrop-blur-glass',
        'transition-all duration-200 active:scale-[0.985]',
        'hover:bg-glass-hover',
        PADDING[padding],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
