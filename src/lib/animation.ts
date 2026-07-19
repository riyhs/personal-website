export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

export const fadeUp = {
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: EASE_OUT },
}

export const fadeOnly = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: EASE_OUT },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.93 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.93 },
  transition: { duration: 0.25, ease: EASE_OUT },
}

export const stagger = (index: number, baseMs = 80) => ({
  delay: index * (baseMs / 1000),
  duration: 0.5,
  ease: EASE_OUT,
})
