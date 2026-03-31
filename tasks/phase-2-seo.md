# TASK: Phase 2 — SEO Optimization

## Context
Worktree: `D:\Dev\Projects\Website\18_riyaldi.com\tanstack\personal-website-wt-upgrade-seo-fouc`
Domain: `https://riyaldi.dev`
Goal: Make home page indexable and rankable on first-page Google for "Riyaldi" and related queries.

## Current SEO Issues
1. No per-route `<title>` overrides (all pages show "Personal Website - Riyaldi")
2. No `og:url` meta tag
3. OG image uses relative path (`/img/website.webp`) instead of absolute URL
4. No per-route og:title/og:description for non-root routes
5. No JSON-LD structured data
6. Blog posts don't have dynamic meta from frontmatter
7. `manifest.json` still says "TanStack App"
8. Sitemap lacks `changefreq` and `priority`

## Steps

### 2.1 — Fix root meta tags in `src/routes/__root.tsx`

In the `head()` function, change the OG image to absolute URL:
```
{ property: 'og:image', content: '/img/website.webp' }
```
→
```
{ property: 'og:image', content: 'https://riyaldi.dev/img/website.webp' }
```

Same for twitter:image:
```
{ name: 'twitter:image', content: 'https://riyaldi.dev/img/website.webp' }
```

### 2.2 — Add per-route head() with title + og:url to each route

**`src/routes/index.tsx`** — update existing `head()`:
```tsx
head: () => ({
  meta: [
    { title: 'Riyaldi - Computer Science Student & Machine Learning Engineer' },
    { name: 'description', content: 'Personal portfolio of Riyaldi Hasan Setiawan. Computer Science undergraduate specializing in Android Development, Fullstack Development, and Machine Learning.' },
    { property: 'og:title', content: 'Riyaldi - Computer Science Student & Machine Learning Engineer' },
    { property: 'og:description', content: 'Personal portfolio of Riyaldi. Explore my projects, blog, and professional journey.' },
    { property: 'og:url', content: 'https://riyaldi.dev/' },
    { property: 'og:type', content: 'website' },
  ],
  links: [
    { rel: 'canonical', href: 'https://riyaldi.dev/' },
  ],
}),
```

**`src/routes/about.tsx`** — add/update `head()`:
```tsx
head: () => ({
  meta: [
    { title: 'About - Riyaldi Hasan Setiawan' },
    { name: 'description', content: 'Learn about Riyaldi Hasan Setiawan - Computer Science student at Universitas Sebelas Maret, Machine Learning Engineer, and Fullstack Developer based in Sukoharjo, Indonesia.' },
    { property: 'og:title', content: 'About - Riyaldi Hasan Setiawan' },
    { property: 'og:description', content: 'Learn about Riyaldi - CS student, ML Engineer, and Fullstack Developer.' },
    { property: 'og:url', content: 'https://riyaldi.dev/about' },
  ],
  links: [
    { rel: 'canonical', href: 'https://riyaldi.dev/about' },
  ],
}),
```

**`src/routes/blog.tsx`** — add/update `head()`:
```tsx
head: () => ({
  meta: [
    { title: 'Blog - Riyaldi' },
    { name: 'description', content: 'Articles and notes on software development, machine learning, and technology by Riyaldi.' },
    { property: 'og:title', content: 'Blog - Riyaldi' },
    { property: 'og:description', content: 'Articles and notes on software development, machine learning, and technology.' },
    { property: 'og:url', content: 'https://riyaldi.dev/blog' },
  ],
  links: [
    { rel: 'canonical', href: 'https://riyaldi.dev/blog' },
  ],
}),
```

**`src/routes/projects.tsx`** — add/update `head()`:
```tsx
head: () => ({
  meta: [
    { title: 'Projects - Riyaldi' },
    { name: 'description', content: 'Selected projects by Riyaldi including P!NGFEST platform, Bangkit ML Capstone, and NutriVision Android app.' },
    { property: 'og:title', content: 'Projects - Riyaldi' },
    { property: 'og:description', content: 'Selected projects by Riyaldi in web development, machine learning, and Android.' },
    { property: 'og:url', content: 'https://riyaldi.dev/projects' },
  ],
  links: [
    { rel: 'canonical', href: 'https://riyaldi.dev/projects' },
  ],
}),
```

### 2.3 — Add dynamic meta for blog posts in `src/routes/blog.$slug.tsx`

The `head()` must use `loaderData` to get frontmatter. Check how loader returns data, then:
```tsx
head: ({ loaderData }) => ({
  meta: [
    { title: `${loaderData.frontmatter.title} - Riyaldi's Blog` },
    { name: 'description', content: loaderData.frontmatter.excerpt },
    { property: 'og:title', content: loaderData.frontmatter.title },
    { property: 'og:description', content: loaderData.frontmatter.excerpt },
    { property: 'og:url', content: `https://riyaldi.dev/blog/${loaderData.slug}` },
    { property: 'og:type', content: 'article' },
    { name: 'twitter:title', content: loaderData.frontmatter.title },
    { name: 'twitter:description', content: loaderData.frontmatter.excerpt },
  ],
  links: [
    { rel: 'canonical', href: `https://riyaldi.dev/blog/${loaderData.slug}` },
  ],
}),
```
**Note:** Read `blog.$slug.tsx` first to see what the loader returns. Adjust field names accordingly.

### 2.4 — Add JSON-LD to home page `src/routes/index.tsx`

Add to the `head()` return:
```tsx
scripts: [
  {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          name: 'Riyaldi - Personal Website',
          url: 'https://riyaldi.dev',
          description: 'Personal portfolio and website of Riyaldi Hasan Setiawan.',
        },
        {
          '@type': 'Person',
          name: 'Riyaldi Hasan Setiawan',
          url: 'https://riyaldi.dev',
          jobTitle: 'Computer Science Student & Machine Learning Engineer',
          sameAs: [
            'https://github.com/riyhs',
            'https://twitter.com/riyhs_',
            'https://www.linkedin.com/in/riyaldi',
          ],
          image: 'https://riyaldi.dev/img/riyaldi-hasan.webp',
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: 'Universitas Sebelas Maret',
          },
        },
      ],
    }),
  },
],
```

### 2.5 — Add JSON-LD to blog posts `src/routes/blog.$slug.tsx`

Add to the `head()` return:
```tsx
scripts: [
  {
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: loaderData.frontmatter.title,
      description: loaderData.frontmatter.excerpt,
      datePublished: loaderData.frontmatter.date,
      author: {
        '@type': 'Person',
        name: 'Riyaldi Hasan Setiawan',
        url: 'https://riyaldi.dev',
      },
      publisher: {
        '@type': 'Person',
        name: 'Riyaldi Hasan Setiawan',
      },
    }),
  },
],
```

### 2.6 — Fix `public/manifest.json`

Replace content with:
```json
{
  "short_name": "Riyaldi",
  "name": "Riyaldi - Personal Website",
  "icons": [
    {
      "src": "favicon.ico",
      "sizes": "64x64 32x32 24x24 16x16",
      "type": "image/x-icon"
    },
    {
      "src": "logo192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "logo512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ],
  "start_url": ".",
  "display": "standalone",
  "theme_color": "#090911",
  "background_color": "#090911"
}
```

### 2.7 — Update sitemap generation `scripts/generate-sitemap.mjs`

Read the file first. Add `changefreq` and `priority` to each URL entry:
- `/` → priority 1.0, changefreq daily
- `/about` → priority 0.8, changefreq monthly
- `/projects` → priority 0.8, changefreq monthly
- `/blog` → priority 0.7, changefreq weekly
- `/blog/*` → priority 0.6, changefreq monthly

### 2.8 — Verify robots.txt

Current content should be:
```
User-agent: *
Disallow: /docs/
Sitemap: https://riyaldi.dev/sitemap.xml
```
Add `Allow: /` line after `Disallow`:
```
User-agent: *
Allow: /
Disallow: /docs/
Sitemap: https://riyaldi.dev/sitemap.xml
```

### 2.9 — Build and verify SSR output
```powershell
pnpm build:only
```
Then check the HTML output:
```powershell
pnpm serve
```
Use curl or browser dev tools to inspect the HTML source of http://localhost:3000:
- Verify `<title>` is "Riyaldi - Computer Science Student & Machine Learning Engineer"
- Verify `og:url` is present
- Verify `og:image` has absolute URL
- Verify JSON-LD script block is present
- Verify canonical link is present

### 2.10 — Commit
```powershell
git add .; git commit -m "feat: comprehensive SEO optimization with JSON-LD, per-route meta, absolute OG URLs"
```

## Success criteria
- Each route has unique `<title>` and `<meta name="description">`
- All OG/Twitter images use absolute `https://riyaldi.dev/...` URLs
- `og:url` present on all routes
- JSON-LD Person + WebSite on home page
- JSON-LD BlogPosting on blog post pages
- `manifest.json` has correct app name
- `robots.txt` has explicit Allow
- Sitemap has changefreq and priority
- `pnpm build:only` exits 0
