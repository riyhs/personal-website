export type Experience = {
    role: string
    company: string
    period: string
    summary: string
    impact: string[]
}

export const experiences: Experience[] = [
    {
        role: 'Machine Learning Cohort',
        company: 'Bangkit Academy (Google, GoTo, Traveloka)',
        period: 'SEP 2024 — DEC 2024',
        summary:
            'Selected for the top 10% of applicants. Enhanced expertise in Data Analysis and Deep Learning while developing a capstone project with a cross-university team.',
        impact: [
            'Developed and deployed a machine learning model using TensorFlow.',
            'Collaborated with peers from 400+ universities on real-world technical solutions.',
        ],
    },
    {
        role: 'Facilitator (Machine Learning)',
        company: 'Lintasarta Digital School',
        period: 'JAN 2024 — APR 2024',
        summary:
            'Guided a class of 25 students through an intermediate Machine Learning curriculum, ensuring a high comprehension rate.',
        impact: [
            'Mentored students to achieve top marks (4/5 or 5/5) through personalized guidance.',
            'Created supplemental learning materials to simplify complex algorithms.',
        ],
    },
    {
        role: 'Lead of Website Development',
        company: 'P!NGFEST 2023',
        period: 'MAR 2023 — SEP 2023',
        summary:
            'Led the technical team for a national competitive programming event, managing both full-stack development and server infrastructure.',
        impact: [
            'Managed VPS infrastructure ensuring 100% uptime for 70+ competing teams.',
            'Led a team of 4 developers to align technical delivery with event goals.',
        ],
    },
]
