import type { ReactNode } from 'react'

interface PageHeaderProps {
  label: ReactNode
  title: string
  lead?: string
  children?: ReactNode
}

// Page intro matching the home hero: grid backdrop, mono label, h1, lead
export function PageHeader({ label, title, lead, children }: PageHeaderProps) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="grid-backdrop pointer-events-none absolute inset-x-0 top-0 h-[24rem]"
      />
      <header className="relative mx-auto w-full max-w-4xl px-5 pt-16 pb-14 motion-safe:animate-fade-up motion-reduce:animate-fade-in sm:pt-20">
        <p className="mono-label">{label}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        {lead && <p className="lead-text mt-6">{lead}</p>}
        {children}
      </header>
    </div>
  )
}
