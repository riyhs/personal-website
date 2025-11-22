import { Link } from '@tanstack/react-router'
import { ArrowUpRight, Mail, MapPin } from 'lucide-react'

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

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[rgb(var(--background))]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-4">
          <p className="text-sm uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.6]">
            Riyaldi
          </p>
          <p className="text-golden-lg font-semibold text-[rgb(var(--foreground))]">
            Ready to ship code and solve hard problems.
          </p>
          <p className="text-sm text-[rgb(var(--foreground))/0.7]">
            Open for Internships and Junior Software Engineering roles starting immediately.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-[rgb(var(--foreground))]">
            <span className="inline-flex items-center gap-2">
              <Mail size={16} />
              <a href="mailto:riyaldi.dev@gmail.com" target="_blank">riyaldi.dev@gmail.com</a>
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={16} />Sukoharjo, Indonesia
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-10 sm:flex-row sm:justify-end">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[rgb(var(--foreground))/0.5]">
              Navigation
            </p>
            <ul className="mt-4 space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="group inline-flex items-center gap-2 text-sm text-[rgb(var(--foreground))/0.75] transition-colors hover:text-[rgb(var(--foreground))]"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[rgb(var(--foreground))/0.5]">
              Availability
            </p>
            <p className="mt-4 text-sm text-[rgb(var(--foreground))/0.75]">
              Currently finishing my Computer Science degree at UNS. Available for freelance or full-time opportunities.
            </p>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 py-6 text-center text-xs tracking-[0.3em] text-[rgb(var(--foreground))/0.4]">
        © {new Date().getFullYear()} Riyaldi · All Rights Reserved
      </div>
    </footer>
  )
}
