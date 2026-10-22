import { createFileRoute } from '@tanstack/react-router'

import { buildIndexMd } from '../lib/llms'

export const Route = createFileRoute('/index.md')({
  server: {
    handlers: {
      GET: () =>
        new Response(buildIndexMd(), {
          headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
        }),
    },
  },
})
