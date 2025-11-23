import { Link, createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight, Github, Linkedin, Twitter, Zap, Maximize2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { useState } from 'react'

import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { ImageModal } from '../components/ImageModal'
import { spotlightProjects } from '../data/projects'
import { techStack } from '../data/stack'
import { listPosts } from '../lib/posts'

export const Route = createFileRoute('/')({
  component: HomePage,
  loader: () => {
    const posts = listPosts().slice(0, 2)
    return {
      projects: spotlightProjects,
      posts: posts.map((post) => ({
        slug: post.slug,
        frontmatter: post.frontmatter,
      })),
    }
  },
})

function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto w-full max-w-6xl px-5 py-16 ${className}`}>
      {children}
    </section>
  )
}

function HomePage() {
  const { projects, posts } = Route.useLoaderData()
  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string } | null>(null)

  return (
    <>
      <div className="space-y-12 pb-16">
      <Section className="flex min-h-[calc(100vh-73px)] items-center justify-center py-10">
        <div className="flex w-full flex-col items-center justify-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="text-4xl font-semibold leading-none tracking-tight sm:text-5xl md:text-6xl lg:text-hero">
              I'm <span className="bg-linear-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">Riyaldi</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-[rgb(var(--foreground))/0.75] sm:text-lg md:text-xl lg:text-2xl">
              Computer Science Undergraduate & Machine Learning Engineer. I combine algorithmic excellence with practical full-stack development to build intelligent applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10 sm:gap-4"
          >
            <Link to="/projects">
              <Button className="rounded-full px-6 text-sm sm:px-8 sm:text-base">
                View Selected Work
              </Button>
            </Link>
            <Link to="/projects">
              <Button variant="outline" className="rounded-full border-white/20 px-6 text-sm text-white/80 hover:bg-white/10 sm:px-8 sm:text-base">
                Download CV
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="rounded-full border-white/20 px-6 text-sm text-white/80 hover:bg-white/10 sm:px-8 sm:text-base">
                About Me
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 flex items-center gap-4 sm:mt-10 sm:gap-6"
          >
            <a
              href="https://github.com/riyhs"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 transition-colors hover:text-white"
              aria-label="GitHub"
            >
              <Github size={20} className="sm:hidden" />
              <Github size={24} className="hidden sm:block" />
            </a>
            <a
              href="https://twitter.com/riyhs"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 transition-colors hover:text-white"
              aria-label="Twitter"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="sm:hidden">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="hidden sm:block">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://www.linkedin.com/in/riyaldi"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 transition-colors hover:text-white"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} className="sm:hidden" />
              <Linkedin size={24} className="hidden sm:block" />
            </a>
          </motion.div>
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">
              Proof of craft
            </p>
            <h2 className="mt-2 text-golden-xl">Featured Projects</h2>
          </div>
          <Link to="/projects" className="w-full md:w-auto">
            <Button variant="outline" className="w-full rounded-full border-white/20 px-6 text-sm text-white/80 hover:bg-white/10 sm:px-8 sm:text-base md:w-auto">
              View all work
            </Button>
          </Link>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {projects.map((project: typeof spotlightProjects[number]) => (
            <Card key={project.title} className="border-white/10 bg-white/5 p-0 overflow-hidden">
              <div className="relative overflow-hidden p-4">
                <div className="relative group">
                  <img
                    src={project.thumbnail}
                    alt={project.title}
                    className="aspect-video w-full rounded-2xl object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-xs rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  <button
                    onClick={() => setSelectedImage({ src: project.thumbnail, alt: project.title })}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-white/30 backdrop-blur-md text-white opacity-0 transition-all duration-300 group-hover:opacity-100 hover:bg-white/50 hover:scale-110 z-10"
                    aria-label="View larger image"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
              <div className="p-6 pt-2">
                <div className="space-y-3">
                  <CardTitle>{project.title}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.stack.map((tech: string) => (
                    <Badge key={tech} variant="outline" className="text-white/70">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap gap-3 text-sm">
                  {project.links.map((link: { label: string; href: string }) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-[rgb(var(--foreground))]"
                    >
                      {link.label}
                      <ArrowUpRight size={14} />
                    </a>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">Stack</p>
            <h2 className="mt-2 text-golden-xl">Tools I reach for daily</h2>
          </div>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {techStack.map((stack) => (
            <Card key={stack.label} className="border-white/10 bg-white/5">
              <CardHeader className="flex items-center justify-between">
                <CardTitle>{stack.label}</CardTitle>
                <Zap className="text-white/70" size={18} />
              </CardHeader>
              <CardContent>
                <CardDescription>{stack.detail}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section>
        <div className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-[rgb(var(--foreground))/0.5]">Writing</p>
          <h2 className="text-golden-xl">Latest notes</h2>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {posts.map((post: { slug: string; frontmatter: { title: string; excerpt: string; date: string } }) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
            >
              <Card className="group border-white/10 bg-white/5 transition-transform hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm uppercase tracking-[0.3em] text-white/60">
                        {new Date(post.frontmatter.date).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <CardTitle className="mt-2">{post.frontmatter.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{post.frontmatter.excerpt}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Section>
      </div>
      <ImageModal
        isOpen={!!selectedImage}
        src={selectedImage?.src || ''}
        alt={selectedImage?.alt || ''}
        onClose={() => setSelectedImage(null)}
      />
    </>
  )
}
