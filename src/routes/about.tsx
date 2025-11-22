import { createFileRoute } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import { GraduationCap, MapPin, TrendingUp } from 'lucide-react'

import { experiences } from '../data/experience'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-16">
      <div className="grid gap-10 md:grid-cols-[0.6fr_1.4fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-[40px] border border-white/10 bg-linear-to-b from-white/10 to-white/0 p-6 text-center"
        >
          <div className="mx-auto h-48 w-48 rounded-[36px] border border-white/20 bg-linear-to-br from-white/40 via-transparent to-transparent p-0.5">
            <div className="h-full w-full rounded-4xl bg-[url('https://riyaldi.vercel.app/_next/image?url=%2Fimg%2Friyaldi_hasan.webp&w=1920&q=75')] bg-cover bg-center" />
          </div>
          <h1 className="mt-6 text-golden-xl">Riyaldi Hasan Setiawan</h1>
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">
            Computer Science Undergraduate
          </p>
          <div className="mt-6 space-y-3 text-sm text-white/75">
            <p className="inline-flex items-center justify-center gap-2">
              <MapPin size={16} /> Based in Sukoharjo, Indonesia
            </p>
            <p className="inline-flex items-center justify-center gap-2">
              <GraduationCap size={16} /> Informatics, Universitas Sebelas Maret (UNS)
            </p>
            <p className="inline-flex items-center justify-center gap-2">
              <TrendingUp size={16} /> Specializing in Web, Mobile, and Machine Learning
            </p>
          </div>
        </motion.div>

        <div className="space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="space-y-5"
          >
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Bio</p>
            <p className="text-lg text-white/80">
              I build intelligent applications where algorithms meet real-world utility. My focus lies in Machine Learning, Android Development, and Scalable Web Systems. I thrive on solving hard logic problems.
            </p>
            <p className="text-lg text-white/70">
              Beyond writing code, I am deeply invested in education. I have mentored over 25 students in Machine Learning fundamentals and actively contribute to the developer community through teaching and facilitation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <p className="text-sm uppercase tracking-[0.4em] text-white/50">Experience</p>
            <div className="mt-6 space-y-8 border-l border-white/10 pl-8">
              {experiences.map((experience) => (
                <div key={experience.company} className="relative">
                  <span className="absolute -left-11 mt-1 h-3 w-3 rounded-full bg-white" />
                  <p className="text-xs uppercase tracking-[0.3em] text-white/60">
                    {experience.period}
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold">{experience.role}</h3>
                  <p className="text-white/70">{experience.company}</p>
                  <p className="mt-3 text-white/70">{experience.summary}</p>
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-white/60">
                    {experience.impact.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
