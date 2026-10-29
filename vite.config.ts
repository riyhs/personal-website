/// <reference types="vitest/config" />
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { defineConfig, type Plugin } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import { parse as parseYaml } from 'yaml'

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

const FRONTMATTER_QUERY = '?frontmatter'
const FRONTMATTER_SUFFIX = '.frontmatter.js'

// `post.mdx?frontmatter` imports only the post's YAML header, so post lists don't bundle
// every post body. The id ends in `.js` because the MDX plugin strips queries and would
// otherwise compile it as MDX.
function mdxFrontmatter(): Plugin {
  return {
    name: 'mdx-frontmatter',
    enforce: 'pre',
    resolveId(source, importer) {
      if (!source.endsWith(`.mdx${FRONTMATTER_QUERY}`) || !importer) return
      const file = resolve(dirname(importer.split('?')[0]), source.slice(0, -FRONTMATTER_QUERY.length))
      return `\0${file}${FRONTMATTER_SUFFIX}`
    },
    load(id) {
      if (!id.startsWith('\0') || !id.endsWith(`.mdx${FRONTMATTER_SUFFIX}`)) return
      const file = id.slice(1, -FRONTMATTER_SUFFIX.length)
      this.addWatchFile(file)
      const header = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(file, 'utf8'))
      return `export default ${JSON.stringify(header ? parseYaml(header[1]) : {})}`
    },
  }
}

const config = defineConfig({
  plugins: [
    !isTest && nitro(),
    mdxFrontmatter(),
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
    // Built-in tsconfig `paths` support (Vite 8), replaces vite-tsconfig-paths
    tsconfigPaths: true,
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
