import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { content } from '../config/content.config'

export default function Hero() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const date = new Date(content.event.akad.dateISO)
  const dateFormatted = date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section id="hero" className="relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>

      {/* Background texture */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/assets/bg-texture.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        aria-hidden="true"
      />

      {/* Tinted scrim over texture */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(175deg, rgba(203,232,248,0.78) 0%, rgba(237,246,253,0.72) 45%, rgba(184,220,239,0.80) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Bottom fade — bleeds into Couple section (mist) */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none"
        style={{ height: '96px', background: 'linear-gradient(to top, #EDF6FD, transparent)', zIndex: 3 }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-svh px-8 pb-16 pt-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
          }}
        >
          <h2 className="font-display text-2xl text-center text-ink mb-8">
            {t('hero.title')}
          </h2>

          <motion.h2
            className="font-display text-6xl sm:text-5xl text-sea leading-tight"
            variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } } }}
          >
            {content.couple.groom.nickname}
          </motion.h2>

          <motion.p
            className="font-script text-3xl text-sky-deep my-2"
            variants={{ hidden: { opacity: 0, scale: 0.75 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } } }}
          >
            &amp;
          </motion.p>

          <motion.h2
            className="font-display text-6xl sm:text-5xl text-sea leading-tight mb-6"
            variants={{ hidden: { opacity: 0, y: 60 }, visible: { opacity: 1, y: 0, transition: { duration: 1.6, ease: [0.22, 1, 0.36, 1] } } }}
          >
            {content.couple.bride.nickname}
          </motion.h2>

          <motion.div
            className="flex items-center justify-center gap-3 mb-6"
            variants={{ hidden: { opacity: 0, scaleX: 0.5 }, visible: { opacity: 1, scaleX: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }}
          >
            <span className="block w-12 h-px bg-sea-light/40" />
            <span className="block w-1.5 h-1.5 rounded-full bg-sea-light/50" />
            <span className="block w-12 h-px bg-sea-light/40" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
