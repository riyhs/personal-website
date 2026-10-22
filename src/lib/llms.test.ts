import { describe, expect, it } from 'vitest'

import { experiences } from '../data/experience'
import { spotlightProjects } from '../data/projects'
import { buildIndexMd, buildLlmsTxt } from './llms'
import { listPosts } from './posts'

describe('buildLlmsTxt', () => {
  const text = buildLlmsTxt()

  it('starts with the llms.txt H1 and blockquote summary', () => {
    const [title, blank, summary] = text.split('\n')
    expect(title).toBe('# Riyaldi Hasan Setiawan')
    expect(blank).toBe('')
    expect(summary.startsWith('> ')).toBe(true)
  })

  it('links every project case study and every post with absolute URLs', () => {
    for (const project of spotlightProjects) {
      expect(text).toContain(`(https://riyaldi.dev/projects/${project.slug})`)
    }
    for (const post of listPosts()) {
      expect(text).toContain(`(https://riyaldi.dev/blog/${post.slug})`)
    }
  })

  it('has no relative markdown links', () => {
    expect(text).not.toMatch(/\]\(\//)
  })
})

describe('buildIndexMd', () => {
  const markdown = buildIndexMd()

  it('includes every experience entry', () => {
    for (const experience of experiences) {
      expect(markdown).toContain(`### ${experience.role}, ${experience.company}`)
    }
  })

  it('includes every project link', () => {
    for (const link of spotlightProjects.flatMap((project) => project.links)) {
      expect(markdown).toContain(`(${link.href})`)
    }
  })
})
