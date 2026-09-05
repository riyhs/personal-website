import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Github,
  Linkedin,
  Menu,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from './ui/button'
import { TwitterIcon } from './ui/TwitterIcon'
import { cn } from '../lib/utils'
import { EASE_OUT } from '../lib/animation'

const primaryLinks = [
  { label: 'Home', href: '/' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'About', href: '/about' },
]

const socials = [
  { 
    icon: Github, 
    href: 'https://github.com/riyhs', 
    label: 'GitHub' 
  },
  {
    icon: TwitterIcon,
    href: 'https://twitter.com/riyhs_',
    label: 'Twitter',
  },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/riyaldi',
    label: 'LinkedIn',
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const activePath = useRouterState({ select: (state) => state.location.pathname })
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])


  const renderLinks = (variant: 'desktop' | 'mobile') => (
    <ul
      className={cn(
        'flex items-center gap-6 text-sm font-semibold tracking-wide',
        variant === 'mobile' && 'flex-col gap-4 text-base',
      )}
    >
      {primaryLinks.map((link) => {
        const isActive = activePath === link.href
        return (
          <li key={link.href}>
            <Link
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'relative px-2 py-1 text-[rgb(var(--foreground))/0.7] transition-colors focus-visible:outline-none',
                isActive && 'text-[rgb(var(--foreground))]',
              )}
            >
              {isActive && (
                <span className="absolute inset-x-0 -bottom-1 h-px bg-[rgb(var(--foreground))]" aria-hidden />
              )}
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <header className="sticky top-0 z-50 h-[73px]">
      <div className="absolute inset-x-0 top-0 w-full backdrop-blur-sm bg-[rgb(var(--background))]/55 border-b border-white/10 shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 text-sm">
          <Link to="/" className="flex items-center gap-3" aria-label="Riyaldi home">
            <div className="h-10 w-10 rounded-2xl bg-white/10 text-white/80 flex items-center justify-center font-black tracking-tight text-lg">
              R
            </div>
            <div>
              <p className="text-lg font-semibold text-[rgb(var(--foreground))]">Riyaldi</p>
            </div>
          </Link>

          <div className="hidden lg:flex flex-1 justify-center">{renderLinks('desktop')}</div>

          <div className="hidden lg:flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.href}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/15"
              >
                <social.icon size={16} />
              </a>
            ))}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden rounded-2xl"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-navigation"
              className="overflow-hidden lg:hidden"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
            >
              <div className="mx-auto max-w-6xl pt-2 pb-8 space-y-6 px-5">
                {renderLinks('mobile')}
                <div className="flex justify-center gap-4 pt-2">
                  {socials.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition-colors hover:bg-white/15"
                    >
                      <social.icon size={16} />
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}
