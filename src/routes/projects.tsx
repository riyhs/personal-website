import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { PageHeader } from '../components/PageHeader'
import { Section } from '../components/Section'
import { spotlightProjects } from '../data/projects'

export const Route = createFileRoute('/projects')({
  head: () => ({
    meta: [
      { title: 'Projects by Riyaldi Hasan Setiawan' },
      {
        name: 'description',
        content:
          'Selected projects by Riyaldi Hasan Setiawan (Riyaldi) including P!NGFEST platform, Bangkit ML Capstone, and NutriVision Android app.',
      },
      {
        name: 'keywords',
        content:
          'Riyaldi Hasan projects, Riyaldi projects, P!NGFEST, Bangkit, NutriVision, Android, Machine Learning, Web Development',
      },
      { property: 'og:title', content: 'Projects by Riyaldi Hasan Setiawan' },
      {
        property: 'og:description',
        content:
          'Selected projects by Riyaldi Hasan Setiawan in web development, machine learning, and Android.',
      },
      { property: 'og:url', content: 'https://riyaldi.dev/projects' },
      { property: 'og:type', content: 'website' },
      { property: 'og:image', content: 'https://riyaldi.dev/img/website.webp' },
      { property: 'og:image:alt', content: 'Projects by Riyaldi Hasan Setiawan' },
      { name: 'twitter:title', content: 'Projects by Riyaldi Hasan Setiawan' },
      {
        name: 'twitter:description',
        content:
          'Selected projects by Riyaldi Hasan Setiawan in web, ML, and Android.',
      },
      { name: 'twitter:image', content: 'https://riyaldi.dev/img/website.webp' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://riyaldi.dev/projects',
      },
    ],
  }),
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="pb-8">
      <PageHeader
        label="Projects"
        title="Engineering Ideas into Reality"
        lead="A curated selection of web, machine learning, and Android projects built from concept to deployed application."
      />

      <Section label={`${spotlightProjects.length} projects`}>
        <ul className="divide-y divide-dashed divide-[rgb(var(--foreground)/0.12)]">
          {spotlightProjects.map((project) => (
            <li
              key={project.slug}
              className="grid gap-5 py-8 first:pt-0 sm:grid-cols-[15rem_1fr] sm:gap-8"
            >
              <Link to="/projects/$slug" params={{ slug: project.slug }} tabIndex={-1} aria-hidden="true">
                <img
                  src={project.thumbnail}
                  alt=""
                  width={640}
                  height={360}
                  loading="lazy"
                  className="aspect-video w-full rounded-xl border border-[rgb(var(--foreground)/0.1)] object-cover"
                />
              </Link>
              <div className="min-w-0">
                <p className="mono-label">
                  {project.year} · {project.platform}
                </p>
                <h3 className="item-title mt-2">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="underline-offset-4 hover:underline"
                  >
                    {project.title}
                  </Link>
                </h3>
                <p className="item-text mt-3">{project.description}</p>
                <p className="mt-3 font-mono text-xs text-[rgb(var(--foreground)/0.6)]">
                  {project.stack.join(' · ')}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="inline-flex items-center gap-1.5 font-semibold text-[rgb(var(--foreground))]"
                  >
                    Case study <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                  {project.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-[rgb(var(--foreground)/0.75)] transition-colors hover:text-[rgb(var(--foreground))]"
                    >
                      {link.label} <ArrowUpRight size={14} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  )
}
