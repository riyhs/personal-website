import { test, expect } from '@playwright/test'

const BASE_URL = 'http://localhost:3003'

test('CSS loads correctly with 200 status', async ({ page }) => {
  const cssResponses: { url: string; status: number; contentType: string }[] = []

  page.on('response', (response) => {
    const url = response.url()
    const contentType = response.headers()['content-type'] || ''
    if (url.endsWith('.css') || contentType.includes('text/css')) {
      cssResponses.push({
        url,
        status: response.status(),
        contentType,
      })
    }
  })

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  // Exactly one stylesheet link should exist
  const stylesheetLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    return Array.from(links).map((link) => link.getAttribute('href'))
  })

  expect(stylesheetLinks.length).toBe(1)
  expect(stylesheetLinks[0]).toMatch(/\/assets\/main-[a-zA-Z0-9_-]+\.css$/)

  // CSS request should return 200 with correct content type
  expect(cssResponses.length).toBe(1)
  expect(cssResponses[0].status).toBe(200)
  expect(cssResponses[0].contentType).toContain('text/css')
})

test('all pages reference the same CSS file', async ({ page }) => {
  const routes = ['/', '/about', '/projects', '/blog']
  let expectedCssHref: string | null = null

  for (const route of routes) {
    await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle' })

    const stylesheetLinks = await page.evaluate(() => {
      const links = document.querySelectorAll('link[rel="stylesheet"]')
      return Array.from(links).map((link) => link.getAttribute('href'))
    })

    expect(stylesheetLinks.length).toBe(1)

    if (!expectedCssHref) {
      expectedCssHref = stylesheetLinks[0]
    } else {
      expect(stylesheetLinks[0]).toBe(expectedCssHref)
    }
  }
})

test('no duplicate stylesheet links', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  const allLinks = await page.evaluate(() => {
    const links = document.querySelectorAll('link[rel="stylesheet"]')
    return Array.from(links).map((link) => link.getAttribute('href'))
  })

  const unique = new Set(allLinks)
  expect(allLinks.length).toBe(unique.size)
  expect(allLinks.length).toBe(1)
})

test('page has visible styled content', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  // Check that the body has a dark background (indicating CSS loaded)
  const bgColor = await page.evaluate(() => {
    return window.getComputedStyle(document.body).backgroundColor
  })

  // Should not be transparent/white (default unstyled)
  expect(bgColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(bgColor).not.toBe('rgb(255, 255, 255)')
})
