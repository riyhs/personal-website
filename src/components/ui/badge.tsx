import type { HTMLAttributes } from 'react'

import { cn } from '../../lib/utils'

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline'
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const styles =
    variant === 'outline'
      ? 'border border-[rgb(var(--border))] text-[rgb(var(--foreground))]'
      : 'bg-[rgb(var(--foreground))/0.1] text-[rgb(var(--foreground))]'

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide backdrop-blur-sm',
        styles,
        className,
      )}
      {...props}
    />
  )
}
