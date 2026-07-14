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

/**
 * variant options:
 *  'fadeUp'    (default) — opacity + y slide up
 *  'fadeIn'    — opacity only, no movement
 *  'slideLeft' — slide in from right
 *  'slideRight'— slide in from left
 *  'scaleUp'   — fade + scale from slightly smaller
 */
const VARIANTS = {
  fadeUp: {
    hidden: { opacity: 0, y: 60 },
    visible: (delay) => ({
      opacity: 1, y: 0,
      transition: { duration: 2.2, ease: [0.22, 1, 0.36, 1], delay },
    }),
  },
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (delay) => ({
      opacity: 1,
      transition: { duration: 2.6, ease: 'easeOut', delay },
    }),
  },
  slideLeft: {
    hidden: { opacity: 0, x: 80 },
    visible: (delay) => ({
      opacity: 1, x: 0,
      transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1], delay },
    }),
  },
  slideRight: {
    hidden: { opacity: 0, x: -80 },
    visible: (delay) => ({
      opacity: 1, x: 0,
      transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1], delay },
    }),
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.82 },
    visible: (delay) => ({
      opacity: 1, scale: 1,
      transition: { duration: 2.1, ease: [0.22, 1, 0.36, 1], delay },
    }),
  },
}

export function Reveal({ children, className = '', delay = 0, as = 'div', variant = 'fadeUp' }) {
  const MotionTag = motion[as] ?? motion.div
  const v = VARIANTS[variant] ?? VARIANTS.fadeUp
  return (
    <MotionTag
      className={className}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.33 }}
      variants={v}
    >
      {children}
    </MotionTag>
  )
}

export function Eyebrow({ children }) {
  return <p className="section-label text-center mb-3">{children}</p>
}

/**
 * bg        : 'texture' | 'mist' | 'sky' | 'pebble'
 * flip      : rotate bg-texture 180deg
 * fadeTop   : hex — color the TOP edge of this section blends FROM
 * fadeBottom: hex — color the BOTTOM edge of this section blends TO
 *
 * Strategy: each section uses a CSS background with gradient layers baked in.
 * For solid-color sections the gradient is layered over the solid color.
 * For texture sections the gradient is layered over the image via a pseudo-div.
 * No overflow or z-index tricks needed — the gradient IS the background.
 */

const BG_COLORS = {
  mist:   '#F7F4ED',
  sky:    '#EEE9DE',
  pebble: '#EEE9DE',
}

/**
 * Build the CSS backgroundImage string for gradient layers.
 * Returns an array of gradient strings to prepend before the actual bg.
 */
function edgeGradients(fadeTop, fadeBottom) {
  const g = []
  if (fadeTop)    g.push(`linear-gradient(to bottom, ${fadeTop} 0%, transparent 25%)`)
  if (fadeBottom) g.push(`linear-gradient(to top,   ${fadeBottom} 0%, transparent 25%)`)
  return g
}

export default function Section({ id, className = '', bg, fadeTop, fadeBottom, children }) {
  const overlays = edgeGradients(fadeTop, fadeBottom)

  return (
    <section id={id} className="relative">

      {/* ── Texture bg → now plain flat color ─────────────────────────────── */}
      {bg === 'texture' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: overlays.length
              ? [...overlays, 'linear-gradient(#F7F4ED, #F7F4ED)'].join(', ')
              : undefined,
            backgroundColor: overlays.length ? undefined : '#F7F4ED',
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Solid-color bg ────────────────────────────────── */}
      {bg && bg !== 'texture' && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: overlays.length
              ? [
                  ...overlays,
                  `linear-gradient(${BG_COLORS[bg]}, ${BG_COLORS[bg]})`,
                ].join(', ')
              : undefined,
            backgroundColor: overlays.length ? undefined : (BG_COLORS[bg] ?? 'transparent'),
            zIndex: 0,
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Content ───────────────────────────────────────── */}
      <div className={`relative px-6 py-20 sm:py-24 max-w-xl mx-auto ${className}`} style={{ zIndex: 2 }}>
        {children}
      </div>
    </section>
  )
}
