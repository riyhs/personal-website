import { Link } from '@tanstack/react-router'
import { Mail, MapPin } from 'lucide-react'
import type { ReactNode } from 'react'

const REPO_URL = 'https://github.com/riyhs/personal-website'

const footerLinks = [
  {
    label: 'Home',
    href: '/',
  },
  {
    label: 'Projects',
    href: '/projects',
  },
  {
    label: 'About',
    href: '/about',
  },
  {
    label: 'Blog',
    href: '/blog',
  },
]

const linkClasses =
  'underline decoration-[rgb(var(--foreground)/0.3)] underline-offset-4 transition-colors hover:decoration-[rgb(var(--foreground))]'

function ColophonItem({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={`border-r border-b border-dashed border-[rgb(var(--foreground)/0.15)] p-4 ${className}`}>
      <dt className="mono-label text-[0.65rem]">{label}</dt>
      <dd className="mt-2 font-mono text-sm text-[rgb(var(--foreground)/0.85)]">{children}</dd>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-[rgb(var(--foreground)/0.1)] bg-[rgb(var(--background))]">
      <div className="mx-auto max-w-4xl space-y-8 px-5 py-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="font-mono text-sm text-[rgb(var(--foreground))]">riyaldi.dev</p>
          <p className="max-w-md text-sm text-[rgb(var(--foreground)/0.75)] sm:text-right">
            Currently finishing my Computer Science degree at UNS. Available for freelance or full-time opportunities.
          </p>
        </div>

        <dl className="grid grid-cols-2 border-t border-l border-dashed border-[rgb(var(--foreground)/0.15)] sm:grid-cols-4">
          <ColophonItem label="Crafted by">Riyaldi</ColophonItem>
          <ColophonItem label="Build">
            {__BUILD_SHA__ && (
              <>
                <a href={`${REPO_URL}/commit/${__BUILD_SHA__}`} target="_blank" rel="noreferrer" className={linkClasses}>
                  {__BUILD_SHA__}
                </a>
                {' · '}
                <wbr />
              </>
            )}
            <span className="whitespace-nowrap">{__BUILD_DATE__}</span>
          </ColophonItem>
          <ColophonItem label="Deployed on">Dokploy</ColophonItem>
          <ColophonItem label="Source code">
            <a href={REPO_URL} target="_blank" rel="noreferrer" className={linkClasses}>
              GitHub
            </a>
          </ColophonItem>
          <ColophonItem label="Typeface">Plus Jakarta Sans · System mono</ColophonItem>
          <ColophonItem label="For agents">
            <span className="flex flex-wrap gap-x-4">
              <a href="/llms.txt" className={linkClasses}>llms.txt</a>
              <a href="/index.md" className={linkClasses}>index.md</a>
            </span>
          </ColophonItem>
          <ColophonItem label="Stack" className="col-span-2">
            TanStack Start · React 19 · Tailwind CSS v4
          </ColophonItem>
        </dl>

        <div className="flex flex-col gap-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className="text-[rgb(var(--foreground)/0.75)] transition-colors hover:text-[rgb(var(--foreground))]"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-[rgb(var(--foreground)/0.75)]">
            <span className="inline-flex items-center gap-2">
              <Mail size={16} aria-hidden />
              <a href="mailto:riyaldi.dev@gmail.com" className="underline-offset-2 hover:underline">riyaldi.dev@gmail.com</a>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} aria-hidden />Sukoharjo, Indonesia
            </span>
          </div>
        </div>

        <p className="mono-label">© {new Date().getFullYear()} Riyaldi</p>
      </div>
    </footer>
  )
}
