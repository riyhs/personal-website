import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import routerPlugin from '@tanstack/router-plugin/vite'
import mdx from '@mdx-js/rollup'
import rehypeShiki from '@shikijs/rehype'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const config = defineConfig({
  plugins: [
    devtools(),
    nitro(),
    routerPlugin(),
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
    tanstackStart(),
    viteReact(),
  ],
  server: {
    host: true
  }
})

export default config
