import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'

interface SectionProps {
  label: string
  link?: { to: string; label: string }
  children: ReactNode
}

// Dashed-rule content block: mono label, optional "see all" link, body
export function Section({ label, link, children }: SectionProps) {
  return (
    <section className="mx-auto w-full max-w-4xl px-5">
      {/* Fade on mount, never whileInView: content must not depend on an IntersectionObserver */}
      <div className="dashed-rule animate-fade-in pt-10 pb-16">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="mono-label">{label}</h2>
          {link && (
            <Link
              to={link.to}
              className="mono-label inline-flex items-center gap-1.5 transition-colors hover:text-[rgb(var(--foreground))]"
            >
              {link.label} <ArrowRight size={12} aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  )
}
