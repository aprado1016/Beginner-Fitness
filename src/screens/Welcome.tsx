import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppState } from '@/state/AppStateContext'
import { Button } from '@/components/ui/Button'
import { DumbbellIcon } from '@/components/icons'

export function Welcome() {
  const navigate = useNavigate()
  const { updatePreferences } = useAppState()
  const [name, setName] = useState('')

  const trimmed = name.trim()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!trimmed) return
    updatePreferences({ name: trimmed })
    navigate('/', { replace: true })
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col items-center justify-center px-6 pb-[max(env(safe-area-inset-bottom,0px),1.5rem)] pt-[max(env(safe-area-inset-top,0px),1.5rem)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="flex w-full max-w-sm flex-col items-center text-center"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-softer shadow-xs">
          <DumbbellIcon className="h-8 w-8 text-fg-brand-strong" />
        </div>

        <h1 className="mt-5 text-2xl font-semibold text-heading">Welcome to your fitness app</h1>
        <p className="mt-2 text-sm text-body-subtle">
          A simple workout companion built just for you. What should we call you?
        </p>

        <form onSubmit={handleSubmit} className="mt-6 w-full">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={30}
            autoFocus
            className="min-h-12 w-full rounded-control border border-border-default-medium bg-neutral-primary-soft px-4 text-center text-base text-heading outline-none focus-visible:border-brand"
          />
          <Button type="submit" size="xl" fullWidth className="mt-4" disabled={!trimmed}>
            Get Started
          </Button>
        </form>
      </motion.div>
    </div>
  )
}
