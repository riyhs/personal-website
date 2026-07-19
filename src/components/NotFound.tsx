import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { fadeUp } from '../lib/animation'

import { getButtonClasses } from './ui/button'
import { cn } from '../lib/utils'

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-5">
      <motion.div
        initial={fadeUp.initial}
        animate={fadeUp.animate}
        transition={fadeUp.transition}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
          404
        </p>
        <h1 className="mt-4 text-golden-xl">Page not found</h1>
        <p className="mt-4 text-lg text-[rgb(var(--foreground))/0.7]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" className={cn(getButtonClasses(), 'mt-8')}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
