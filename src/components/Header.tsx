import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Menu,
  Moon,
  Sun,
  X
} from 'lucide-react'
import { useEffect, useState } from 'react'

import { useTheme } from './ThemeProvider'
import { Button } from './ui/button'
import { GithubIcon } from './ui/GithubIcon'
import { LinkedinIcon } from './ui/LinkedinIcon'
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
    icon: GithubIcon, 
    href: 'https://github.com/riyhs', 
    label: 'GitHub' 
  },
  {
    icon: TwitterIcon,
    href: 'https://twitter.com/riyhs_',
    label: 'Twitter',
  },
  {
    icon: LinkedinIcon,
    href: 'https://www.linkedin.com/in/riyaldi',
    label: 'LinkedIn',
  },
]

const iconButtonClasses =
  'rounded-full border border-[rgb(var(--foreground)/0.1)] bg-[rgb(var(--foreground)/0.05)] p-2 text-[rgb(var(--foreground)/0.8)] transition-colors hover:bg-[rgb(var(--foreground)/0.15)]'

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  // Icons switch via the `light:` CSS variant so they match the pre-hydration theme script
  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Dark theme"
      aria-pressed={isDark}
      className={iconButtonClasses}
    >
      <Moon size={16} className="light:hidden" aria-hidden />
      <Sun size={16} className="hidden light:block" aria-hidden />
    </button>
  )
}

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
        'flex items-center gap-6 text-sm',
        variant === 'mobile' && 'flex-col gap-4 text-base',
      )}
    >
      {primaryLinks.map((link) => {
        const isActive =
          activePath === link.href || (link.href !== '/' && activePath.startsWith(`${link.href}/`))
        return (
          <li key={link.href}>
            <Link
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                'px-2 py-1 text-[rgb(var(--foreground)/0.75)] transition-colors hover:text-[rgb(var(--foreground))] focus-visible:outline-none',
                isActive && 'text-[rgb(var(--foreground))]',
              )}
            >
              {link.label}
            </Link>
          </li>
        )
      })}
    </ul>
  )

  return (
    <header className="sticky top-0 z-50 h-[73px]">
      <div className="absolute inset-x-0 top-0 w-full backdrop-blur-sm bg-[rgb(var(--background))]/55 border-b border-[rgb(var(--foreground)/0.1)] shadow-[var(--shadow-soft)]">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 text-sm">
          <Link to="/" className="flex items-center gap-3" aria-label="Riyaldi home">
            <img src="/logo.svg" alt="" width={40} height={40} className="h-10 w-10 rounded-xl" />
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
                className={iconButtonClasses}
              >
                <social.icon size={16} />
              </a>
            ))}
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="sm"
              className="rounded-2xl"
              aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-navigation"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
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
              <div className="mx-auto max-w-4xl pt-2 pb-8 space-y-6 px-5">
                {renderLinks('mobile')}
                <div className="flex justify-center gap-4 pt-2">
                  {socials.map((social) => (
                    <a
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className={iconButtonClasses}
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
