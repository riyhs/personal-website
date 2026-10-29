import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Suspense } from 'react'

import { PageHeader } from '../components/PageHeader'
import { formatLongDate } from '../lib/date'
import { findPostBySlug, getPostBody, loadPostBody } from '../lib/posts'

export const Route = createFileRoute('/blog_/$slug')({
  codeSplitGroupings: [['loader', 'component']],
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {}
    }
    const data = loaderData as unknown as {
      slug: string
      frontmatter: {
        title: string
        excerpt: string
        date: string
        tags: string[]
      }
    }
    return {
      meta: [
        { title: `${data.frontmatter.title} - Riyaldi Hasan Setiawan's Blog` },
        { name: 'description', content: data.frontmatter.excerpt },
        {
          name: 'keywords',
          content: `Riyaldi Hasan blog, Riyaldi, ${data.frontmatter.tags.join(', ')}`,
        },
        { property: 'og:title', content: data.frontmatter.title },
        { property: 'og:description', content: data.frontmatter.excerpt },
        { property: 'og:url', content: `https://riyaldi.dev/blog/${params.slug as string}` },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: 'https://riyaldi.dev/img/website.webp' },
        { property: 'og:image:alt', content: data.frontmatter.title },
        { name: 'twitter:title', content: data.frontmatter.title },
        { name: 'twitter:description', content: data.frontmatter.excerpt },
        { name: 'twitter:image', content: 'https://riyaldi.dev/img/website.webp' },
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
            headline: data.frontmatter.title,
            description: data.frontmatter.excerpt,
            datePublished: data.frontmatter.date,
            keywords: data.frontmatter.tags.join(', '),
            author: {
              '@type': 'Person',
              name: 'Riyaldi Hasan Setiawan',
              alternateName: ['Riyaldi', 'Riyaldi Hasan', 'riyhs'],
              url: 'https://riyaldi.dev',
            },
            publisher: {
              '@type': 'Person',
              name: 'Riyaldi Hasan Setiawan',
              url: 'https://riyaldi.dev',
            },
            mainEntityOfPage: {
              '@type': 'WebPage',
              '@id': `https://riyaldi.dev/blog/${params.slug as string}`,
            },
          }),
        },
      ],
    }
  },
  component: BlogDetailPage,
  loader: async ({ params }) => {
    const post = findPostBySlug(params.slug as string)
    if (!post) {
      throw notFound()
    }
    await loadPostBody(post.slug)
    return {
      slug: post.slug,
      frontmatter: post.frontmatter,
    }
  },
})

function BlogDetailPage() {
  const { slug } = Route.useLoaderData() as unknown as { slug: string }
  const post = findPostBySlug(slug)
  const Content = getPostBody(slug)

  if (!post || !Content) {
    return null
  }

  return (
    <article className="pb-16">
      <PageHeader
        label={
          <>
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 transition-colors hover:text-[rgb(var(--foreground))]"
            >
              <ArrowLeft size={14} aria-hidden="true" /> All posts
            </Link>
            <span className="mt-10 block">
              <time dateTime={post.frontmatter.date}>{formatLongDate(post.frontmatter.date)}</time>
              {' · '}
              {post.frontmatter.readingTime}
            </span>
          </>
        }
        title={post.frontmatter.title}
        lead={post.frontmatter.excerpt}
      >
        <p className="mt-6 font-mono text-xs text-[rgb(var(--foreground)/0.6)]">
          {post.frontmatter.tags.map((tag) => `#${tag}`).join('  ')}
        </p>
      </PageHeader>

      <div className="mx-auto w-full max-w-4xl px-5">
        <div className="dashed-rule animate-fade-in pt-4 [animation-delay:200ms]">
          <div className="mdx-content max-w-3xl">
            <Suspense>
              <Content />
            </Suspense>
          </div>
        </div>
      </div>
    </article>
  )
}
