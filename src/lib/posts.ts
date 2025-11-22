import type { ComponentType } from 'react'

export interface BlogFrontmatter {
    title: string
    excerpt: string
    date: string
    tags: string[]
    readingTime: string
}

export interface BlogPost {
    slug: string
    frontmatter: BlogFrontmatter
    Component: ComponentType
}

type BlogModule = {
    default: ComponentType
    frontmatter: BlogFrontmatter
}

const postModules = import.meta.glob('../content/blog/*.mdx', {
    eager: true,
}) as Record<string, BlogModule>

const posts: BlogPost[] = Object.entries(postModules)
    .flatMap(([path, module]) => {
        const frontmatter = module.frontmatter
        const slug = path.split('/').pop()?.replace('.mdx', '') ?? ''

        if (!frontmatter?.date) {
            return []
        }

        return [
            {
                slug,
                frontmatter,
                Component: module.default,
            },
        ]
    })
    .sort((a, b) =>
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime(),
    )

export function listPosts() {
    return posts
}

export function findPostBySlug(slug: string) {
    return posts.find((post) => post.slug === slug)
}
