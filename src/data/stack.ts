export type StackGroup = {
  label: string
  items: string[]
}

export const techStack: StackGroup[] = [
  { label: 'Languages', items: ['Python', 'TypeScript', 'Kotlin', 'Rust', 'Go', 'PHP'] },
  {
    label: 'Web',
    items: ['React', 'TanStack Start', 'Next.js', 'Tailwind CSS', 'Django REST Framework', 'Laravel', 'Flask', 'MySQL'],
  },
  { label: 'Mobile', items: ['Android', 'Jetpack Compose', 'Hilt', 'Room', 'ML Kit', 'Firebase'] },
  { label: 'Data & ML', items: ['TensorFlow', 'pandas', 'Matplotlib'] },
  { label: 'AI workflow', items: ['Pi agent', 'OpenCode', 'Claude Code', 'Hermes Agent', 'herdr'] },
  { label: 'Infrastructure', items: ['Linux', 'Docker', 'Nginx', 'GitHub Actions', 'Dokploy'] },
]
