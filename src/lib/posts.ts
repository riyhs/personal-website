import { lazy, type ComponentType } from 'react'

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
}

// Only the YAML headers (see `mdxFrontmatter` in vite.config.ts), so listing posts never
// bundles their bodies
const frontmatterModules = import.meta.glob<BlogFrontmatter>('../content/blog/*.mdx', {
    eager: true,
    query: '?frontmatter',
    import: 'default',
})

// Each body is its own chunk, fetched only by the post's page
const bodyModules = import.meta.glob<ComponentType>('../content/blog/*.mdx', {
    import: 'default',
})

const postPath = (slug: string) => `../content/blog/${slug}.mdx`

const posts: BlogPost[] = Object.entries(frontmatterModules)
    .flatMap(([path, frontmatter]) => {
        const slug = path.split('/').pop()?.replace('.mdx', '') ?? ''

        if (!frontmatter?.date) {
            return []
        }

        return [{ slug, frontmatter }]
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

const loadedBodies = new Map<string, ComponentType>()
const lazyBodies = new Map<string, ComponentType>()

// Loaders await this, so a navigation renders the body as soon as the page mounts
export async function loadPostBody(slug: string) {
    const load = bodyModules[postPath(slug)]
    if (load && !loadedBodies.has(slug)) {
        loadedBodies.set(slug, await load())
    }
}

// The body a loader already fetched. During hydration no loader has run on the client, so
// it falls back to a lazy component: under <Suspense> React keeps the server HTML until the
// chunk arrives.
export function getPostBody(slug: string): ComponentType | undefined {
    const loaded = loadedBodies.get(slug)
    if (loaded) return loaded

    const load = bodyModules[postPath(slug)]
    if (!load) return undefined

    let body = lazyBodies.get(slug)
    if (!body) {
        body = lazy(() => load().then((component) => ({ default: component })))
        lazyBodies.set(slug, body)
    }
    return body
}
