import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

import { PageHeader } from './PageHeader'
import { getButtonClasses } from './ui/button'
import { cn } from '../lib/utils'

export function NotFound() {
  return (
    <div className="min-h-[calc(100svh-73px-20rem)]">
      <PageHeader
        label="404"
        title="Page not found"
        lead="The page you're looking for doesn't exist or has been moved."
      >
        <Link to="/" className={cn(getButtonClasses(), 'mt-8 gap-2 px-6 text-sm')}>
          <ArrowLeft size={16} aria-hidden="true" /> Back to Home
        </Link>
      </PageHeader>
    </div>
  )
}
