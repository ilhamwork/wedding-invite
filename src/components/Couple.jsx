import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { content } from '../config/content.config'
import { Reveal } from './ui/Section'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%23EEE9DE'/%3E%3C/svg%3E"

const ease = [0.22, 1, 0.36, 1]

/**
 * Oval photo frame — centered, with book-page reveal animation.
 */
function OvalFrame({ src, alt, side = 'left' }) {
  return (
    <div
      style={{
        perspective: 800,
        width: 220,
        height: 300,
        flexShrink: 0,
        margin: '0 auto',
      }}
    >
      <motion.div
        className="relative flex items-center justify-center w-full h-full"
        style={{
          transformOrigin: side === 'left' ? 'right center' : 'left center',
          transformStyle: 'preserve-3d',
        }}
        initial={{ rotateY: side === 'left' ? -110 : 110 }}
        whileInView={{ rotateY: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 5.0, ease, delay: 0.3 }}
      >
        {/* Outer decorative ring */}
        <div
          className="absolute inset-0"
          style={{
            borderRadius: '50%',
            border: '2px solid rgba(201,169,110,0.45)',
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute"
          style={{
            inset: 8,
            borderRadius: '50%',
            border: '1px solid rgba(201,169,110,0.25)',
          }}
        />
        {/* Photo */}
        <div
          className="absolute overflow-hidden"
          style={{ inset: 5, borderRadius: '50%' }}
        >
          <img
            src={src ?? PLACEHOLDER}
            alt={alt}
            className="w-full h-full object-cover object-top"
          />
        </div>
      </motion.div>
    </div>
  )
}

export default function Couple() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const { bride, groom } = content.couple

  return (
    <section id="couple" className="relative overflow-hidden">
      <div className="relative px-6 pt-20 pb-16 max-w-lg mx-auto">

        {/* Bismillah + invite tagline */}
        <Reveal variant="fadeIn" delay={0.05}>
          <div className="flex flex-col items-center mb-16">
            <img
              src="/assets/bismillah.png"
              alt="Bismillah"
              className="w-48 sm:w-56 mb-4 opacity-70"
            />
            <p
              className="font-body text-[11px] tracking-widest uppercase text-center"
              style={{ color: 'rgba(74,95,122,0.75)' }}
            >
              We cordially invite you to our wedding
            </p>
          </div>
        </Reveal>

        {/* BRIDE */}
        <Reveal variant="fadeIn" delay={0.1}>
          <div className="flex flex-col items-center text-center">
            <OvalFrame src={bride.photo} alt={bride.fullName} side="left" />
            <h3
              className="font-display font-semibold leading-tight mt-6 mb-1 px-4"
              style={{ fontSize: '1.55rem', color: '#2E3A4F', letterSpacing: '0.02em' }}
            >
              {bride.fullName}
            </h3>
            {bride.parents?.[lang] && (
              <p
                className="text-sm leading-relaxed whitespace-pre-line px-4 mt-1"
                style={{ color: 'rgba(74,95,122,0.85)' }}
              >
                {bride.parents[lang]}
              </p>
            )}

          </div>
        </Reveal>

        {/* Ampersand connector */}
        <Reveal variant="fadeIn" delay={0.2}>
          <div className="flex items-center justify-center gap-4 my-10 px-8">
            <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.30)' }} />
            <span
              className="font-script text-5xl leading-none select-none pt-2"
              style={{ color: 'rgba(201,169,110,0.70)' }}
            >
              &amp;
            </span>
            <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.30)' }} />
          </div>
        </Reveal>

        {/* GROOM */}
        <Reveal variant="fadeIn" delay={0.3}>
          <div className="flex flex-col items-center text-center">
            <OvalFrame src={groom.photo} alt={groom.fullName} side="right" />
            <h3
              className="font-display font-semibold leading-tight mt-6 mb-1 px-4"
              style={{ fontSize: '1.55rem', color: '#2E3A4F', letterSpacing: '0.02em' }}
            >
              {groom.fullName}
            </h3>
            {groom.parents?.[lang] && (
              <p
                className="text-sm leading-relaxed whitespace-pre-line px-4 mt-1"
                style={{ color: 'rgba(74,95,122,0.85)' }}
              >
                {groom.parents[lang]}
              </p>
            )}

          </div>
        </Reveal>

      </div>
    </section>
  )
}
