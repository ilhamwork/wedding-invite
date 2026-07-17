import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { content } from '../config/content.config'
import { Reveal } from './ui/Section'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%23EEE9DE'/%3E%3C/svg%3E"

const ease = [0.22, 1, 0.36, 1]

/**
 * Oval photo frame with book-page reveal animation.
 */
function OvalFrame({ src, alt, side = 'left' }) {
  return (
    <motion.div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: 150, height: 200 }}
      initial={{ opacity: 0, rotateY: side === 'left' ? -90 : 90, originX: side === 'left' ? 0 : 1 }}
      whileInView={{ opacity: 1, rotateY: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.9, ease }}
    >
      {/* Outer decorative ring */}
      <div
        className="absolute inset-0"
        style={{
          borderRadius: '50%',
          border: '2px solid rgba(201,169,110,0.35)',
        }}
      />
      {/* Inner ring */}
      <div
        className="absolute"
        style={{
          inset: 8,
          borderRadius: '50%',
          border: '1px solid rgba(201,169,110,0.20)',
        }}
      />
      {/* Photo — no background, just the image clipped to oval */}
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
  )
}

export default function Couple() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const { bride, groom } = content.couple

  return (
    <section id="couple" className="relative overflow-hidden">
      <div className="relative px-6 pt-20 pb-16 max-w-lg mx-auto">

        {/* ── Bismillah ── */}
        <Reveal variant="fadeIn">
          <p
            className="text-center text-3xl leading-loose mb-4"
            style={{ fontFamily: 'serif', direction: 'rtl', color: 'rgba(46,58,79,0.75)' }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </p>
        </Reveal>

        {/* ── Section title ── */}
        <Reveal variant="fadeIn" delay={0.08}>
          <p className="font-body text-xs tracking-[0.3em] uppercase text-center text-sea-light/70 mb-14">
            {t('couple.title')}
          </p>
        </Reveal>

        {/* ── BRIDE ROW ── */}
        <Reveal variant="fadeIn" delay={0.1}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="shrink-0 -mt-4">
              <OvalFrame src={bride.photo} alt={bride.fullName} side="left" />
            </div>
            <div className="flex flex-col items-end text-right pt-8 flex-1">
              <h3
                className="font-display font-semibold leading-tight mb-4"
                style={{ fontSize: '1.65rem', color: '#33302B', letterSpacing: '0.02em' }}
              >
                {bride.fullName}
              </h3>
              {bride.parents?.[lang] && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(46,58,79,0.60)' }}>
                  {bride.parents[lang]}
                </p>
              )}
            </div>
          </div>
        </Reveal>

        {/* ── Ampersand connector ── */}
        <Reveal variant="fadeIn" delay={0.18}>
          <div className="flex items-center justify-center my-2">
            <span className="font-script text-5xl leading-none select-none" style={{ color: 'rgba(201,169,110,0.55)' }}>
              &amp;
            </span>
          </div>
        </Reveal>

        {/* ── GROOM ROW ── */}
        <Reveal variant="fadeIn" delay={0.26}>
          <div className="flex items-start justify-between gap-4 mt-4">
            <div className="flex flex-col items-start text-left pt-8 flex-1">
              <h3
                className="font-display font-semibold leading-tight mb-4"
                style={{ fontSize: '1.65rem', color: '#33302B', letterSpacing: '0.02em' }}
              >
                {groom.fullName}
              </h3>
              {groom.parents?.[lang] && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(46,58,79,0.60)' }}>
                  {groom.parents[lang]}
                </p>
              )}
            </div>
            <div className="shrink-0 -mt-4">
              <OvalFrame src={groom.photo} alt={groom.fullName} side="right" />
            </div>
          </div>
        </Reveal>

      </div>
    </section>
  )
}
