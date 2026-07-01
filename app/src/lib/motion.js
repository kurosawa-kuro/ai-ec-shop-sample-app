// Shared animation variants for Motion

export const EASE = [0.25, 0.1, 0.25, 1]

export const staggerGrid = {
  hidden: {},
  show: { transition: { staggerChildren: 0.032, delayChildren: 0.03 } },
}

export const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
}

export const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.32, ease: EASE } },
}

export const slideLeft = {
  hidden: { opacity: 0, x: -22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
}

export const slideRight = {
  hidden: { opacity: 0, x: 22 },
  show: { opacity: 1, x: 0, transition: { duration: 0.42, ease: EASE } },
}

export const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.36, ease: EASE } },
}
