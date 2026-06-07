import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'

import { Badge } from '../components/ui/badge'
import { experiences } from '../data/experience'

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

const skillGroups = [
  {
    label: 'Languages',
    skills: ['Python', 'Kotlin', 'JavaScript', 'TypeScript'],
  },
  {
    label: 'Frameworks / Libraries',
    skills: ['React', 'Laravel', 'Flask', 'TensorFlow', 'Jetpack Compose'],
  },
  {
    label: 'Tools / Platforms',
    skills: ['Linux', 'VPS', 'Firebase', 'Git'],
  },
  {
    label: 'Domains',
    skills: ['Web Development', 'Android', 'Machine Learning', 'DevOps'],
  },
]

function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-5 py-16">
      <div className="space-y-14">
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-4 text-center md:text-left"
        >
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
              About
            </p>
            <h1 className="text-golden-xl">Riyaldi Hasan Setiawan</h1>
            <p className="text-lg text-[rgb(var(--foreground))/0.75]">
              Computer Science undergraduate turning algorithms into shipped systems.
            </p>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="space-y-6 border-t border-white/10 pt-10"
        >
          <div className="space-y-2">
            <p className="text-sm uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
              Skills
            </p>
            <h2 className="text-2xl font-semibold">Tools I use to ship</h2>
          </div>
          <div className="space-y-6">
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="grid gap-3 sm:grid-cols-[12rem_1fr]"
              >
                <h3 className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-white/75"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="border-t border-white/10 pt-10"
        >
          <p className="text-sm uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
            Experience
          </p>
          <div className="mt-8 space-y-10 border-l-2 border-white/10 pl-8">
            {experiences.map((experience) => (
              <div key={experience.company} className="relative">
                <span className="absolute -left-[39px] top-0 h-3 w-3 rounded-full border-2 border-[rgb(var(--background))] bg-white" />
                <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                  {experience.period}
                </p>
                <h3 className="mt-2 text-2xl font-semibold">
                  {experience.role}
                </h3>
                <p className="text-white/70">{experience.company}</p>
                <p className="mt-3 text-white/70">{experience.summary}</p>
                <ul className="mt-4 list-disc space-y-2 pl-5 text-white/60">
                  {experience.impact.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
