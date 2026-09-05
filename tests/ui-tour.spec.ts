import { test, expect } from '@playwright/test'

test('interactive navigation & UI tour', async ({ page }) => {
  // 1. Visit Home Page
  await page.goto('/')
  await expect(page).toHaveTitle(/Riyaldi/)

  // 2. Slow scroll down to see the content and animations
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(800)
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(800)
  await page.mouse.wheel(0, -1400)
  await page.waitForTimeout(600)

  // 3. Toggle Theme if theme toggle button is present
  const themeToggle = page.getByRole('button', { name: /theme|mode|toggle/i })
  if (await themeToggle.isVisible()) {
    await themeToggle.click()
    await page.waitForTimeout(1000)
    await themeToggle.click()
    await page.waitForTimeout(1000)
  }

  // 4. Navigate to About via Nav Header
  const aboutLink = page.getByRole('banner').getByRole('link', { name: /^about$/i })
  await aboutLink.click()
  await expect(page).toHaveURL(/.*about/)
  await page.waitForTimeout(1000)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(1000)

  // 5. Navigate to Projects via Nav Header
  const projectsLink = page.getByRole('banner').getByRole('link', { name: /^projects$/i })
  await projectsLink.click()
  await expect(page).toHaveURL(/.*projects/)
  await page.waitForTimeout(1000)
  await page.mouse.wheel(0, 800)
  await page.waitForTimeout(1000)

  // 6. Navigate to Blog via Nav Header
  const blogLink = page.getByRole('banner').getByRole('link', { name: /^blog$/i })
  await blogLink.click()
  await expect(page).toHaveURL(/.*blog/)
  await page.waitForTimeout(1000)
  await page.mouse.wheel(0, 600)
  await page.waitForTimeout(1000)

  // 7. Back to Home
  const homeLink = page.getByRole('banner').getByRole('link', { name: /riyaldi|home/i })
  if (await homeLink.count() > 0) {
    await homeLink.first().click()
  } else {
    await page.goto('/')
  }
  await page.waitForTimeout(1500)
  await page.waitForTimeout(1200)
})
