import { describe, expect, it } from 'vitest'

import { findPostBySlug, getPostBody, listPosts, loadPostBody } from './posts'

describe('posts', () => {
  it('lists posts from their frontmatter alone, newest first', () => {
    const posts = listPosts()
    expect(posts.length).toBeGreaterThan(0)
    for (const post of posts) {
      expect(Object.keys(post).sort()).toEqual(['frontmatter', 'slug'])
      expect(post.frontmatter.title).toBeTypeOf('string')
      expect(Array.isArray(post.frontmatter.tags)).toBe(true)
    }
    const dates = posts.map((post) => new Date(post.frontmatter.date).getTime())
    expect(dates).toEqual([...dates].sort((a, b) => b - a))
  })

  it('parses the YAML header of hello-world', () => {
    expect(findPostBySlug('hello-world')?.frontmatter).toMatchObject({
      title: 'Hello World',
      date: '2025-11-22',
      tags: ['general', 'life', 'coding'],
      readingTime: '2 min read',
    })
  })

  // A cold first run compiles the MDX body with Shiki, which measured ~6s once
  it('returns the loaded body once a loader has fetched it', { timeout: 20_000 }, async () => {
    await loadPostBody('hello-world')
    const body = getPostBody('hello-world')
    expect(body).toBeTypeOf('function')
    // The real MDX component, not the lazy wrapper used during hydration
    expect((body as { $$typeof?: symbol }).$$typeof).toBeUndefined()
  })

  it('returns nothing for an unknown slug', async () => {
    await loadPostBody('missing')
    expect(getPostBody('missing')).toBeUndefined()
  })
})
