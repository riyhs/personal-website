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
          className="rounded-3xl border border-white/10 bg-white/5 p-0 text-center overflow-hidden"
        >
          <div className="relative overflow-hidden p-4">
            <div className="mx-auto h-48 w-48 rounded-2xl overflow-hidden">
              <div className="h-full w-full bg-[url('https://riyaldi.vercel.app/_next/image?url=%2Fimg%2Friyaldi_hasan.webp&w=1920&q=75')] bg-cover bg-center" />
            </div>
          </div>
          <div className="p-6 pt-2">
            <h1 className="text-golden-xl">Riyaldi Hasan Setiawan</h1>
            <p className="text-sm uppercase tracking-[0.4em] text-white/60">
              Computer Science Undergraduate
            </p>
            <div className="mt-6 space-y-3 text-sm text-white/75">
              <p className="flex items-start justify-center gap-2">
                <MapPin size={16} className="mt-1.5 shrink-0" /> <span>Based in Sukoharjo, Indonesia</span>
              </p>
              <p className="flex items-start justify-center gap-2">
                <GraduationCap size={16} className="mt-1.5 shrink-0" /> <span>Informatics, Universitas Sebelas Maret (UNS)</span>
              </p>
              <p className="flex items-start justify-center gap-2">
                <TrendingUp size={16} className="mt-1.5 shrink-0" /> <span>Specializing in Web, Mobile, and Machine Learning</span>
              </p>
            </div>
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
            <div className="mt-6 space-y-8 border-l-2 border-white/10 pl-8">
              {experiences.map((experience) => (
                <div key={experience.company} className="relative">
                  <span className="absolute -left-[39px] top-0 h-3 w-3 rounded-full border-2 border-[rgb(var(--background))] bg-white" />
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
