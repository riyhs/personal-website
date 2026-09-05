// @vitest-environment jsdom
import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { afterEach, describe, it, expect, vi } from 'vitest'
import Header from './Header'

afterEach(() => {
  cleanup()
})

interface MockLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children?: ReactNode
  to?: string
}

vi.mock('@tanstack/react-router', () => ({
  Link: ({ children, to, onClick, ...props }: MockLinkProps) => (
    <a href={to} onClick={onClick} {...props}>
      {children}
    </a>
  ),
  useRouterState: vi.fn(() => '/'),
}))

describe('Header', () => {
  it('has only 1 child inside <header> both before and after expanding the mobile menu', () => {
    const { container } = render(<Header />)
    const header = container.querySelector('header')!
    expect(header).toBeDefined()
    expect(header.children.length).toBe(1)

    const glassPanel = header.firstElementChild as HTMLElement
    expect(glassPanel).toBeDefined()
    expect(glassPanel.className).toContain('border-b')
    expect(glassPanel.className).toContain('backdrop-blur-sm')
    expect(glassPanel.className).toContain('bg-[rgb(var(--background))]/55')
    expect(glassPanel.className).toContain('shadow-[var(--shadow-soft)]')
    // Only 1 logo link exists initially
    expect(screen.getAllByLabelText(/riyaldi home/i).length).toBe(1)

    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
    expect(menuButton.getAttribute('aria-expanded')).toBe('false')

    // Click to open
    fireEvent.click(menuButton)

    // <header> must still have strictly 1 direct child (the single unified glass panel)
    expect(header.children.length).toBe(1)
    expect(glassPanel.className).toContain('backdrop-blur-sm')
    expect(glassPanel.className).toContain('bg-[rgb(var(--background))]/55')
    expect(glassPanel.className).toContain('border-b')
    expect(glassPanel.className).toContain('shadow-[var(--shadow-soft)]')

    // Verify the mobile navigation element is nested inside the single glass panel and does NOT duplicate background/blur
    const mobileNav = container.querySelector('#mobile-navigation')!
    expect(mobileNav).toBeDefined()
    expect(mobileNav.className).not.toContain('backdrop-blur-sm')
    expect(mobileNav.className).not.toContain('bg-[rgb(var(--background))]/55')
    expect(mobileNav.className).toContain('overflow-hidden')

    // Border between menus and buttons inside expanded area is removed
    const socialsContainer = mobileNav.querySelector('a[aria-label="Twitter"]')?.parentElement
    expect(socialsContainer).toBeDefined()
    expect(socialsContainer?.className).not.toContain('border-t')
    // Still exactly 1 logo link (no duplicated logo in an overlay header bar)
    expect(screen.getAllByLabelText(/riyaldi home/i).length).toBe(1)

    // Button should now indicate close state
    const closeButton = screen.getByRole('button', { name: /close navigation menu/i })
    expect(closeButton.getAttribute('aria-expanded')).toBe('true')

    // Click close button
    fireEvent.click(closeButton)
    expect(header.children.length).toBe(1)
  })

  it('closes mobile menu when navigation link is clicked', () => {
    const { container } = render(<Header />)
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(menuButton)
    expect(container.querySelector('#mobile-navigation')).toBeDefined()

    // Find and click the mobile About link
    const aboutLinks = screen.getAllByRole('link', { name: /about/i })
    fireEvent.click(aboutLinks[aboutLinks.length - 1])

    expect(screen.queryByRole('button', { name: /close navigation menu/i })).toBeNull()
  })

  it('closes mobile menu when Escape key is pressed', () => {
    render(<Header />)
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i })
    fireEvent.click(menuButton)
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toBeDefined()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.queryByRole('button', { name: /close navigation menu/i })).toBeNull()
  })
})
