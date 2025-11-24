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
            '/img/projects/Pingfest.webp',
        stack: ['React', 'Laravel', 'DevOps'],
        links: [
            { label: 'Frontend GitHub', href: 'https://github.com/riyhs/pingfest-fe' },
            { label: 'Backend GitHub', href: 'https://github.com/riyhs/pingfest-be' },
        ],
    },
    {
        title: 'Bangkit Machine Learning Capstone',
        description:
            'Selected as Google Bangkit Academy cohorts (10% Acceptance Rate). Developed a TensorFlow model for real-world application, collaborating with a cross-university team.',
        year: '2024',
        thumbnail:
            '/img/projects/AritmaPlay.webp',
        stack: ['Python', 'TensorFlow', 'Flask'],
        links: [
            { label: 'Project GitHub', href: 'https://github.com/AritmaPlay' },
            { label: 'Model API GitHub', href: 'https://github.com/AritmaPlay/aritmaplay-ml-api' },
        ],
    },
    {
        title: 'NutriVision Android App',
        description:
            'Native Android application built with Kotlin. Applied intermediate mobile development principles to create a seamless user experience.',
        year: '2025',
        thumbnail:
            '/img/projects/NutriVision.webp',
        stack: ['Kotlin', 'Android', 'Jetpack Compose', 'Firebase'],
        links: [
            { label: 'GitHub', href: 'https://github.com/riyhs/nutrivision' },
        ],
    },
]
