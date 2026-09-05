import { chromium } from '@playwright/test'

async function runLiveBrowser() {
  console.log('🚀 Membuka browser Chromium di layar...')

  const browser = await chromium.launch({
    headless: false,
    slowMo: 600, // delay antar aksi agar pergerakan terlihat jelas di layar
    env: {
      ...process.env,
      LD_LIBRARY_PATH: `${process.env.HOME}/.local/lib/chromium-libs/usr/lib/x86_64-linux-gnu:${process.env.LD_LIBRARY_PATH || ''}`,
    },
  })

  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
  })

  const page = await context.newPage()

  try {
    // 1. Kunjungi Home
    console.log('📍 1. Membuka http://localhost:3000...')
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' })
    await page.waitForTimeout(1500)

    // 2. Scroll pelan di Home
    console.log('📜 2. Melakukan scroll pada Home Page...')
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 350)
      await page.waitForTimeout(700)
    }
    await page.mouse.wheel(0, -1400)
    await page.waitForTimeout(1000)

    // 3. Hover link navigasi
    console.log('👆 3. Hovering menu navigasi...')
    const navAbout = page.getByRole('banner').getByRole('link', { name: /^about$/i })
    await navAbout.hover()
    await page.waitForTimeout(800)

    const navProjects = page.getByRole('banner').getByRole('link', { name: /^projects$/i })
    await navProjects.hover()
    await page.waitForTimeout(800)

    // 4. Buka halaman About
    console.log('📍 4. Navigasi ke halaman About...')
    await navAbout.click()
    await page.waitForTimeout(1500)
    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 300)
      await page.waitForTimeout(600)
    }

    // 5. Buka halaman Projects
    console.log('📍 5. Navigasi ke halaman Projects...')
    await navProjects.click()
    await page.waitForTimeout(1500)
    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 350)
      await page.waitForTimeout(600)
    }

    // 6. Buka halaman Blog
    console.log('📍 6. Navigasi ke halaman Blog...')
    const navBlog = page.getByRole('banner').getByRole('link', { name: /^blog$/i })
    await navBlog.click()
    await page.waitForTimeout(1500)
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(1000)

    // 7. Kembali ke Home
    console.log('📍 7. Kembali ke halaman Home...')
    const navHome = page.getByRole('banner').getByRole('link', { name: /riyaldi|home/i })
    if (await navHome.count() > 0) {
      await navHome.first().click()
    } else {
      await page.goto('http://localhost:3000')
    }
    await page.waitForTimeout(2000)

    console.log('✅ Selesai! Menutup browser...')
  } finally {
    await browser.close()
  }
}

runLiveBrowser().catch((err) => {
  console.error('Error saat menjalankan browser:', err)
})
