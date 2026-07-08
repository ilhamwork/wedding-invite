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
  mist:   '#EDF6FD',
  sky:    '#CBE8F8',
  pebble: '#D4EDFA',
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

export default function Section({ id, className = '', bg, flip = false, fadeTop, fadeBottom, children }) {
  const overlays = edgeGradients(fadeTop, fadeBottom)

  return (
    <section id={id} className="relative">

      {/* ── Texture bg ────────────────────────────────────── */}
      {bg === 'texture' && (
        <>
          {/* Rotatable image layer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "url('/assets/bg-texture.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              transform: flip ? 'rotate(180deg)' : 'none',
              zIndex: 0,
            }}
            aria-hidden="true"
          />
          {/* Scrim + edge fades as a single layered gradient on top of image */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: [
                ...overlays,
                'linear-gradient(180deg, rgba(237,246,253,0.75) 0%, rgba(203,232,248,0.70) 100%)',
              ].join(', '),
              zIndex: 1,
            }}
            aria-hidden="true"
          />
        </>
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
