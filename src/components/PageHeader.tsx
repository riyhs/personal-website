import type { ReactNode } from 'react'

import { GridBackdrop } from './GridBackdrop'

interface PageHeaderProps {
  label: ReactNode
  title: string
  lead?: string
  children?: ReactNode
  // One-time touch intro on the grid, used by the home page only
  introRipple?: boolean
}

// Page intro matching the home hero: grid backdrop, mono label, h1, lead
export function PageHeader({ label, title, lead, children, introRipple }: PageHeaderProps) {
  return (
    <GridBackdrop introRipple={introRipple}>
      <header className="relative mx-auto w-full max-w-4xl px-5 pt-16 pb-14 motion-safe:animate-fade-up motion-reduce:animate-fade-in sm:pt-20">
        <p className="mono-label">{label}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
          {title}
        </h1>
        {lead && <p className="lead-text mt-6">{lead}</p>}
        {children}
      </header>
    </GridBackdrop>
  )
}
