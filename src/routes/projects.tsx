import { createFileRoute } from '@tanstack/react-router'
import { ArrowUpRight } from 'lucide-react'
import { motion } from 'framer-motion'

import { Badge } from '../components/ui/badge'
import { Card } from '../components/ui/card'
import { spotlightProjects } from '../data/projects'

export const Route = createFileRoute('/projects')({
  component: ProjectsPage,
})

function ProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="space-y-4 text-center md:text-left">
        <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
          Riyaldi · Projects
        </p>
        <h1 className="text-golden-xl">Engineering Ideas into Reality</h1>
        <p className="text-lg text-[rgb(var(--foreground))/0.75] md:max-w-2xl">
          A curated selection of technical challenges solved across Web Development, Machine Learning, and Android Engineering. These projects demonstrate my ability to move from concept to deployed application.
        </p>
      </div>

      <div className="mt-12 space-y-10">
        {spotlightProjects.map((project, index) => (
          <motion.div
            key={project.title}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
          >
            <Card className="border-white/10 bg-white/5 p-0">
              <div className="grid gap-0 md:grid-cols-[1.1fr_0.9fr]">
                <div className="relative overflow-hidden rounded-3xl p-6">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="h-64 w-full rounded-3xl object-cover"
                    loading="lazy"
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                        {project.year}
                      </p>
                      <h2 className="text-3xl font-semibold">{project.title}</h2>
                    </div>
                    <div className="text-sm text-white/60">{project.stack.slice(0, 2).join(' • ')}</div>
                  </div>
                </div>

                <div className="space-y-5 border-t border-white/10 p-6 md:border-t-0 md:border-l">
                  <p className="text-base text-white/80">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-white/80">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-white"
                      >
                        {link.label}
                        <ArrowUpRight size={14} />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
