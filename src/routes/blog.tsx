import { Link, createFileRoute } from '@tanstack/react-router'

import { PageHeader } from '../components/PageHeader'
import { Section } from '../components/Section'
import { formatShortDate } from '../lib/date'
import { listPosts } from '../lib/posts'

export const Route = createFileRoute('/blog')({
  head: () => ({
    meta: [
      { title: 'Blog - Riyaldi Hasan Setiawan' },
      {
        name: 'description',
        content:
          'Articles and notes on software development, machine learning, and technology by Riyaldi Hasan Setiawan (Riyaldi).',
      },
      {
        name: 'keywords',
        content:
          'Riyaldi Hasan blog, Riyaldi blog, software engineering blog, machine learning articles, technology notes',
      },
      { property: 'og:title', content: 'Blog - Riyaldi Hasan Setiawan' },
      {
        property: 'og:description',
        content:
          'Articles and notes on software development, machine learning, and technology by Riyaldi Hasan Setiawan.',
      },
      { property: 'og:url', content: 'https://riyaldi.dev/blog' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://riyaldi.dev/img/website.webp' },
      { property: 'og:image:alt', content: 'Blog - Riyaldi Hasan Setiawan' },
      { name: 'twitter:title', content: 'Blog - Riyaldi Hasan Setiawan' },
      {
        name: 'twitter:description',
        content:
          'Articles and notes on software development, machine learning, and technology by Riyaldi Hasan Setiawan.',
      },
      { name: 'twitter:image', content: 'https://riyaldi.dev/img/website.webp' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://riyaldi.dev/blog',
      },
    ],
  }),
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

  return (
    <div className="pb-8">
      <PageHeader
        label="Writing"
        title="Notes on algorithms, learning, and code"
        lead="A collection of technical essays, project debriefs, and learnings from my journey in software engineering."
      />

      <Section label={`${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`}>
        <ul className="divide-y divide-dashed divide-[rgb(var(--foreground)/0.12)]">
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
            <li key={post.slug}>
              <Link
                to="/blog/$slug"
                params={{ slug: post.slug }}
                className="group grid gap-2 py-6 sm:grid-cols-[8rem_1fr] sm:gap-6"
              >
                <time dateTime={post.frontmatter.date} className="mono-label sm:pt-1">
                  {formatShortDate(post.frontmatter.date)}
                </time>
                <div>
                  <h3 className="item-title group-hover:underline">
                    {post.frontmatter.title}
                  </h3>
                  <p className="item-text mt-2">{post.frontmatter.excerpt}</p>
                  <p className="mt-3 font-mono text-xs text-[rgb(var(--foreground)/0.6)]">
                    {post.frontmatter.readingTime} · {post.frontmatter.tags.join(', ')}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
