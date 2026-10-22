import { createFileRoute } from '@tanstack/react-router'

import { PageHeader } from '../components/PageHeader'
import { Section } from '../components/Section'
import { experiences } from '../data/experience'
import { techStack } from '../data/stack'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About Riyaldi Hasan Setiawan - Software Engineer' },
      {
        name: 'description',
        content:
          'About Riyaldi Hasan Setiawan (Riyaldi) — Computer Science student at Universitas Sebelas Maret, Machine Learning Engineer, and Fullstack Developer based in Sukoharjo, Indonesia.',
      },
      {
        name: 'keywords',
        content:
          'About Riyaldi, Riyaldi Hasan, Riyaldi Hasan Setiawan, Software Engineer, Machine Learning Engineer, Fullstack Developer, Universitas Sebelas Maret, Sukoharjo',
      },
      { property: 'og:title', content: 'About Riyaldi Hasan Setiawan' },
      {
        property: 'og:description',
        content:
          'About Riyaldi Hasan Setiawan (Riyaldi) — CS student, ML Engineer, and Fullstack Developer.',
      },
      { property: 'og:url', content: 'https://riyaldi.dev/about' },
      { property: 'og:type', content: 'profile' },
      {
        property: 'og:image',
        content: 'https://riyaldi.dev/img/riyaldi-hasan.webp',
      },
      { property: 'og:image:alt', content: 'Riyaldi Hasan Setiawan' },
      { name: 'twitter:title', content: 'About Riyaldi Hasan Setiawan' },
      {
        name: 'twitter:description',
        content:
          'About Riyaldi Hasan Setiawan — CS student, ML Engineer, and Fullstack Developer.',
      },
      {
        name: 'twitter:image',
        content: 'https://riyaldi.dev/img/riyaldi-hasan.webp',
      },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://riyaldi.dev/about',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="pb-8">
      <PageHeader
        label="About"
        title="Riyaldi Hasan Setiawan"
        lead="Computer Science undergraduate turning algorithms into shipped systems."
      />

      <Section label="Skills">
        <dl className="space-y-4 sm:space-y-3">
          {techStack.map((group) => (
            <div key={group.label} className="grid gap-1 sm:grid-cols-[11rem_1fr] sm:gap-6">
              <dt className="text-sm text-[rgb(var(--foreground)/0.6)]">{group.label}</dt>
              <dd className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-[rgb(var(--foreground)/0.9)]">
                {group.items.map((item) => (
                  <span key={item}>{item}</span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </Section>
      <Section label="Experience">
        <ol className="divide-y divide-dashed divide-[rgb(var(--foreground)/0.12)]">
          {experiences.map((experience) => (
            <li
              key={experience.company}
              className="grid gap-2 py-8 first:pt-0 sm:grid-cols-[11rem_1fr] sm:gap-6"
            >
              <p className="mono-label sm:pt-1.5">{experience.period}</p>
              <div>
                <h3 className="item-title">
                  {experience.role}
                </h3>
                <p className="text-[rgb(var(--foreground)/0.6)]">{experience.company}</p>
                <p className="item-text mt-3">{experience.summary}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5">
                  {experience.impact.map((item) => (
                    <li key={item} className="text-[rgb(var(--foreground)/0.75)]">{item}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Section>

    </div>
  )
}
