import { Link, Outlet, createFileRoute, useMatches } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { listPosts } from '../lib/posts'

export const Route = createFileRoute('/blog')({
  component: BlogPage,
  loader: () => {
    const posts = listPosts()
    return {
      posts: posts.map((post) => ({
        slug: post.slug,
        frontmatter: post.frontmatter,
      })),
    }
  },
})

function BlogPage() {
  const { posts } = Route.useLoaderData()
  const matches = useMatches()
  const isDetailPage = matches.some(match => match.routeId === '/blog/$slug')

  return (
    <>
      <Outlet />
      {!isDetailPage && (
        <div className="mx-auto max-w-6xl px-5 py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 text-center md:text-left"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-white/60">Journal</p>
            <h1 className="text-golden-xl">Notes on algorithms, learning, and code</h1>
            <p className="text-lg text-white/70">
              A collection of technical essays, project debriefs, and learnings from my journey in software engineering.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-12 space-y-8"
          >
        {posts.map((post: {
          slug: string
          frontmatter: {
            title: string
            excerpt: string
            date: string
            tags: string[]
            readingTime: string
          }
        }) => (
          <Card key={post.slug} className="border-white/10 bg-white/5 p-0">
            <CardHeader className="gap-4 border-b border-white/5 p-6 md:flex md:items-center md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/50">
                  {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
                <CardTitle className="mt-3 text-3xl">{post.frontmatter.title}</CardTitle>
                <CardDescription>{post.frontmatter.excerpt}</CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {post.frontmatter.tags.map((tag: string) => (
                  <Badge key={tag} variant="outline" className="text-white/70">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-white/60">{post.frontmatter.readingTime}</p>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm font-semibold text-white hover:bg-white/10"
                aria-label={`Read ${post.frontmatter.title}`}
              >
                Read article <ArrowRight size={16} />
              </Link>
            </CardContent>
          </Card>
        ))}
      </motion.div>
    </div>
      )}
    </>
  )
}
