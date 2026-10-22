/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const isTest = Boolean(process.env.VITEST)

// Docker builds have no .git (see .dockerignore), so CI passes GIT_SHA as a build arg
function getBuildSha() {
  if (process.env.GIT_SHA) {
    return process.env.GIT_SHA.slice(0, 7)
  }
  try {
    return execSync('git rev-parse --short=7 HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim()
  } catch {
    return ''
  }
}

const config = defineConfig({
  plugins: [
    !isTest && nitro(),
    // this is the plugin that enables path aliases
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        [remarkMdxFrontmatter, { name: 'frontmatter' }]
      ],
      rehypePlugins: [
        [
          rehypeShiki,
          {
            themes: {
              dark: 'github-dark-default',
            },
            defaultColor: 'dark',
          },
        ],
      ],
    }),
    tailwindcss(),
    !isTest && tanstackStart(),
    viteReact(),
  ].filter(Boolean),
  define: {
    __BUILD_SHA__: JSON.stringify(getBuildSha()),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  test: {
    environment: 'jsdom',
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      'tests/**',
      'seed.spec.ts',
    ],
  },
  server: {
    host: true
  }
})

export default config
