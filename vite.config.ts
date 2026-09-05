/// <reference types="vitest/config" />
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
