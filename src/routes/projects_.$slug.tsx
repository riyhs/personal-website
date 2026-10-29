import { Link, createFileRoute, notFound } from '@tanstack/react-router'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import type { ReactNode } from 'react'

import { DigitDemo } from '../components/DigitDemo'
import { PageHeader } from '../components/PageHeader'
import { cn } from '../lib/utils'
import { spotlightProjects } from '../data/projects'

export const Route = createFileRoute('/projects_/$slug')({
  loader: ({ params }) => {
    const project = spotlightProjects.find((item) => item.slug === params.slug)
    if (!project) {
      throw notFound()
    }
    return { project }
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {}
    }
    const { project } = loaderData
    const url = `https://riyaldi.dev/projects/${params.slug}`
    const title = `${project.title} - Riyaldi Hasan Setiawan`
    return {
      meta: [
        { title },
        { name: 'description', content: project.description },
        { property: 'og:title', content: title },
        { property: 'og:description', content: project.description },
        { property: 'og:url', content: url },
        { property: 'og:type', content: 'article' },
        { property: 'og:image', content: `https://riyaldi.dev${project.thumbnail}` },
        { property: 'og:image:alt', content: project.title },
        { name: 'twitter:title', content: title },
        { name: 'twitter:description', content: project.description },
        { name: 'twitter:image', content: `https://riyaldi.dev${project.thumbnail}` },
      ],
      links: [{ rel: 'canonical', href: url }],
    }
  },
  component: ProjectDetailPage,
})

function MetaItem({
  label,
  children,
  className,
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn('border-r border-b border-dashed border-[rgb(var(--foreground)/0.15)] p-4', className)}>
      <dt className="mono-label text-[0.65rem]">{label}</dt>
      <dd className="mt-2 text-sm text-[rgb(var(--foreground)/0.9)]">{children}</dd>
    </div>
  )
}

function ProjectDetailPage() {
  const { project } = Route.useLoaderData()

  return (
    <article className="pb-16">
      <PageHeader
        label={
          <>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 transition-colors hover:text-[rgb(var(--foreground))]"
            >
              <ArrowLeft size={14} aria-hidden="true" /> All projects
            </Link>
            <span className="mt-10 block">
              {project.year} · {project.platform}
            </span>
          </>
        }
        title={project.title}
      />

      <div className="mx-auto w-full max-w-4xl px-5 [animation-delay:100ms] motion-safe:animate-fade-up motion-reduce:animate-fade-in">
        {/* First large element on the page (LCP), so fetch it ahead of other images */}
        <img
          src={project.thumbnail}
          alt={`${project.title} screenshot`}
          width={1280}
          height={720}
          fetchPriority="high"
          className="aspect-video w-full rounded-2xl border border-[rgb(var(--foreground)/0.1)] object-cover"
        />

        <dl className="mt-6 grid grid-cols-2 border-t border-l border-dashed border-[rgb(var(--foreground)/0.15)] sm:grid-cols-4">
          {project.role && <MetaItem label="Role">{project.role}</MetaItem>}
          <MetaItem label="Platform">{project.platform}</MetaItem>
          <MetaItem label="Year">{project.year}</MetaItem>
          <MetaItem label="Stack" className={cn(!project.role && 'col-span-2')}>
            {project.stack.join(' · ')}
          </MetaItem>
        </dl>

        <p className="lead-text mt-10">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[rgb(var(--foreground))] underline decoration-[rgb(var(--foreground)/0.3)] underline-offset-4 transition-colors hover:decoration-[rgb(var(--foreground))]"
            >
              {link.label}
              <ArrowUpRight size={14} aria-hidden="true" />
            </a>
          ))}
        </div>

        {project.demo === 'digit' && <DigitDemo />}

        {project.highlights && (
          <section className="dashed-rule mt-14 pt-10">
            <h2 className="mono-label">Highlights</h2>
            <ul className="mt-6 list-disc space-y-2 pl-5">
              {project.highlights.map((item) => (
                <li key={item} className="text-[rgb(var(--foreground)/0.75)]">{item}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
