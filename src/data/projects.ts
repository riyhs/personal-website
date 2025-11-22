export type Project = {
    title: string
    description: string
    year: string
    thumbnail: string
    stack: string[]
    links: { label: string; href: string }[]
}

export const spotlightProjects: Project[] = [
    {
        title: 'P!NGFEST 2023 Platform',
        description:
            'Led the web team and managed VPS infrastructure to support a national competitive programming event. Delivered 100% uptime for 70+ competing teams.',
        year: '2023',
        thumbnail:
            'https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=800&q=80',
        stack: ['React', 'Laravel', 'DevOps'],
        links: [
            { label: 'View Case Study', href: 'https://riyaldi.com/projects/atlas' },
            { label: 'GitHub', href: 'https://github.com/riyaldi/atlas' },
        ],
    },
    {
        title: 'Bangkit Machine Learning Capstone',
        description:
            'Selected as Google Bangkit Academy cohorts (10% Acceptance Rate). Developed a TensorFlow model for real-world application, collaborating with a cross-university team.',
        year: '2024',
        thumbnail:
            'https://images.unsplash.com/photo-1476610182048-b716b8518aae?auto=format&fit=crop&w=800&q=80',
        stack: ['Python', 'TensorFlow', 'Flask'],
        links: [
            { label: 'GitHub', href: 'https://marlin-edge.vercel.app' },
        ],
    },
    {
        title: 'NutriVision Android App',
        description:
            'Native Android application built with Kotlin. Applied intermediate mobile development principles to create a seamless user experience.',
        year: '2025',
        thumbnail:
            'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
        stack: ['Kotlin', 'Android', 'Jetpack Compose', 'Firebase'],
        links: [
            { label: 'Docs', href: 'https://docs.riyaldi.com/dockstream' },
            { label: 'GitHub', href: 'https://github.com/riyhs/nutrivision' },
        ],
    },
]
