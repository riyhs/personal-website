import { Link, useRouterState } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Github,
  Linkedin,
  Menu,
  X
} from 'lucide-react'
import { useState } from 'react'

import { Button } from './ui/button'
import { cn } from '../lib/utils'

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
    icon: () => (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
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
    <header className={cn(
      "sticky top-0 z-50 border-b border-white/10",
      !isOpen && "backdrop-blur-xl glass-panel"
    )}>
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
          aria-label="Open navigation menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={20} />
        </Button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-x-0 top-0 border-b border-white/10 bg-[rgb(var(--background))]/50 backdrop-blur-xl shadow-lg glass-panel overflow-hidden"
            initial={{ height: 'auto', opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeIn' }}
          >
            <div className="mx-auto max-w-6xl ">
              <div className="flex items-center justify-between px-5 py-4 text-sm">
                <Link to="/" className="flex items-center gap-3" aria-label="Riyaldi home">
                  <div className="h-10 w-10 rounded-2xl bg-white/10 text-white/80 flex items-center justify-center font-black tracking-tight text-lg">
                    R
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[rgb(var(--foreground))]">Riyaldi</p>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close navigation menu"
                  className="rounded-2xl"
                >
                  <X size={20} />
                </Button>
              </div>
              <motion.div 
                className="pt-8 space-y-8 mx-5 mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
              >
                {renderLinks('mobile')}
                <div className="flex justify-center gap-4">
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
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
