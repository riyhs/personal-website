import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export function NotFound() {
  return (
    <div className="flex min-h-[calc(100dvh-73px)] items-center justify-center px-5">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
          404
        </p>
        <h1 className="mt-4 text-golden-xl">Page not found</h1>
        <p className="mt-4 text-lg text-[rgb(var(--foreground))/0.7]">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-[rgb(var(--foreground))] text-[rgb(var(--background))] px-6 py-2 text-sm font-semibold shadow-2xl shadow-black/25 transition-all hover:bg-[rgb(var(--foreground))]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--background))]"
        >
          <ArrowLeft size={16} aria-hidden="true" /> Back to Home
        </Link>
      </motion.div>
    </div>
  )
}
