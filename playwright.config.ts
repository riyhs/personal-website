import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    headless: false,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          headless: false,
          slowMo: 400,
          env: {
            ...process.env,
            LD_LIBRARY_PATH: `${process.env.HOME}/.local/lib/chromium-libs/usr/lib/x86_64-linux-gnu:${process.env.LD_LIBRARY_PATH || ''}`,
          },
        },
      },
    },
  ],
})
