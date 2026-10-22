import { experiences } from '../data/experience'
import { profile } from '../data/profile'
import { spotlightProjects } from '../data/projects'
import { techStack } from '../data/stack'
import { listPosts } from './posts'

const SITE_URL = 'https://riyaldi.dev'

export function buildLlmsTxt() {
  const posts = listPosts()
  return [
    `# ${profile.name}`,
    '',
    `> ${profile.name} is a software engineer in Sukoharjo, Indonesia, building web apps, Android apps, and machine learning systems. This site collects projects, experience, and writing.`,
    '',
    '## Main pages',
    '',
    `- [Home](${SITE_URL}/): Overview, selected work, stack, and recent writing.`,
    `- [Home as Markdown](${SITE_URL}/index.md): Text version of the home page, including experience.`,
    `- [About](${SITE_URL}/about): Skills and work experience.`,
    `- [Projects](${SITE_URL}/projects): All published projects.`,
    `- [Blog](${SITE_URL}/blog): All published articles.`,
    '',
    '## Projects',
    '',
    ...spotlightProjects.map(
      (project) => `- [${project.title}](${SITE_URL}/projects/${project.slug}): ${project.description}`,
    ),
    '',
    '## Writing',
    '',
    ...posts.map(
      (post) => `- [${post.frontmatter.title}](${SITE_URL}/blog/${post.slug}): ${post.frontmatter.excerpt}`,
    ),
    '',
  ].join('\n')
}

export function buildIndexMd() {
  const posts = listPosts()
  return [
    `# ${profile.name}`,
    '',
    profile.tagline,
    '',
    profile.summary,
    '',
    profile.recent,
    '',
    '## Selected work',
    '',
    ...spotlightProjects.flatMap((project) => [
      `### [${project.title}](${SITE_URL}/projects/${project.slug})`,
      '',
      `${project.year} · ${project.platform} · ${project.stack.join(', ')}`,
      '',
      project.description,
      '',
      ...project.links.map((link) => `- [${link.label}](${link.href})`),
      '',
    ]),
    '## Experience',
    '',
    ...experiences.flatMap((experience) => [
      `### ${experience.role}, ${experience.company}`,
      '',
      experience.period,
      '',
      experience.summary,
      '',
      ...experience.impact.map((item) => `- ${item}`),
      '',
    ]),
    '## Stack',
    '',
    ...techStack.map((group) => `- **${group.label}:** ${group.items.join(', ')}`),
    '',
    '## Writing',
    '',
    ...posts.map(
      (post) => `- ${post.frontmatter.date}: [${post.frontmatter.title}](${SITE_URL}/blog/${post.slug})`,
    ),
    '',
    '## Contact',
    '',
    `- Email: ${profile.email}`,
    ...profile.socials.map((social) => `- ${social.label}: ${social.href}`),
    '',
  ].join('\n')
}
