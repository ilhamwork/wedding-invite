import { motion } from 'framer-motion'
import { CornerSprig } from './Ornaments'

const revealVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export function Reveal({ children, className = '', delay = 0, as = 'div' }) {
  const MotionTag = motion[as] ?? motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={revealVariants}
      transition={{ delay }}
    >
      {children}
    </MotionTag>
  )
}

export function Eyebrow({ children }) {
  return <p className="section-label text-center mb-3">{children}</p>
}

export default function Section({ id, className = '', children }) {
  return (
    <section
      id={id}
      className={`relative px-6 py-20 sm:py-24 max-w-xl mx-auto ${className}`}
    >
      {children}
    </section>
  )
}
