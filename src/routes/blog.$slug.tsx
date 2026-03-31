import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

import { Badge } from '../components/ui/badge'
import { formatLongDate } from '../lib/date'
import { findPostBySlug } from '../lib/posts'

export const Route = createFileRoute('/blog/$slug')({
  head: ({ loaderData, params }) => ({
    meta: [
      { title: `${loaderData.frontmatter.title} - Riyaldi's Blog` },
      { name: 'description', content: loaderData.frontmatter.excerpt },
      { property: 'og:title', content: loaderData.frontmatter.title },
      { property: 'og:description', content: loaderData.frontmatter.excerpt },
      { property: 'og:url', content: `https://riyaldi.dev/blog/${params.slug as string}` },
      { property: 'og:type', content: 'article' },
      { name: 'twitter:title', content: loaderData.frontmatter.title },
      { name: 'twitter:description', content: loaderData.frontmatter.excerpt },
    ],
    links: [
      {
        rel: 'canonical',
        href: `https://riyaldi.dev/blog/${params.slug as string}`,
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: loaderData.frontmatter.title,
          description: loaderData.frontmatter.excerpt,
          datePublished: loaderData.frontmatter.date,
          author: {
            '@type': 'Person',
            name: 'Riyaldi Hasan Setiawan',
            url: 'https://riyaldi.dev',
          },
          publisher: {
            '@type': 'Person',
            name: 'Riyaldi Hasan Setiawan',
          },
        }),
      },
    ],
  }),
  component: BlogDetailPage,
  loader: ({ params }) => {
    const post = findPostBySlug(params.slug as string)
    if (!post) {
      throw new Error('Post not found')
    }
    return {
      slug: post.slug,
      frontmatter: post.frontmatter,
    }
  },
})

function BlogDetailPage() {
  const { slug } = Route.useLoaderData()
  const post = findPostBySlug(slug)

  if (!post) {
    return null
  }
  const Content = post.Component

  return (
    <article className="mx-auto max-w-3xl px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to Blog
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="mt-8 space-y-6"
      >
        <p className="text-xs uppercase tracking-[0.4em] text-white/60">
          {formatLongDate(post.frontmatter.date)}
        </p>
        <h1 className="text-golden-xl">{post.frontmatter.title}</h1>
        <p className="text-lg text-white/75">{post.frontmatter.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.frontmatter.tags.map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-white/70">
              {tag}
            </Badge>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="mdx-content mt-12"
      >
        <Content />
      </motion.div>
    </article>
  )
}
