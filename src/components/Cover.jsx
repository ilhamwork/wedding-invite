import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import LanguageToggle from './LanguageToggle'
import { useAudio } from '../context/AudioContext'

// ─── Animation helpers ─────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]
const fadeUp  = (delay = 0, y = 60)   => ({ initial: { opacity: 0, y },        animate: { opacity: 1, y: 0 },    transition: { duration: 1.8, ease, delay } })
const fadeIn  = (delay = 0, dur = 1.8)=> ({ initial: { opacity: 0 },            animate: { opacity: 1 },          transition: { duration: dur,  ease, delay } })
const scaleFd = (delay = 0)           => ({ initial: { opacity: 0, scale: .80 },animate: { opacity: 1, scale: 1 },transition: { duration: 1.8, ease, delay } })
const slideX  = (delay = 0, x = -60)  => ({ initial: { opacity: 0, x },         animate: { opacity: 1, x: 0 },    transition: { duration: 1.8, ease, delay } }) // eslint-disable-line no-unused-vars

// ─── Cover Component ───────────────────────────────────────────────────────────
export default function Cover({ guestName, onOpen }) {
  const { t } = useTranslation()
  const [isOpening, setIsOpening] = useState(false)
  const { unlockAndPlay } = useAudio()

  function handleOpen() {
    if (isOpening) return
    setIsOpening(true)
    unlockAndPlay()
    setTimeout(() => { onOpen() }, 1100)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-hidden"
        style={{
          backgroundImage: "url('/assets/bg-texture.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
        exit={{ opacity: 0, transition: { duration: 0.7, delay: 0.2 } }}
      >
        {/* Scrim over texture — sama seperti section texture lainnya */}
        <div className="absolute inset-0 z-[1]" style={{ background: 'linear-gradient(180deg, rgba(237,246,253,0.78) 0%, rgba(203,232,248,0.72) 100%)' }} />

        {/* Language toggle */}
        <motion.div className="absolute top-5 right-5 z-20" {...fadeIn(1.6)}>
          <LanguageToggle />
        </motion.div>

        {/* ── Centre oval card ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
          animate={isOpening ? { y: -40, opacity: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          {/* Content container — no oval */}
          <motion.div
            className="relative w-full flex flex-col items-center text-center"
            style={{ height: '70vh' }}
            {...scaleFd(0.3)}
          >
            {/* Content — vertically centred */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">

              {/* Invite copy */}
              <motion.p
                className="font-body text-[16px] text-ink-soft/70 mb-4"
                {...fadeIn(0.8)}
              >
                {t('cover.eyebrow')}
              </motion.p>

              {/* Names */}
              <motion.h1
                className="font-display text-4xl sm:text-5xl text-ink leading-snug mb-10 text-center"
                {...fadeUp(1.0, 18)}
              >
                {content.couple.groom.nickname}
                <span className="font-script text-3xl text-sea-light mx-2">&amp;</span>
                {content.couple.bride.nickname}
              </motion.h1>

              {/* CTA button */}
              <motion.button
                type="button"
                onClick={handleOpen}
                disabled={isOpening}
                className="group relative flex items-center gap-2 px-7 py-3 rounded-full text-cream font-body text-xs tracking-[0.20em] uppercase overflow-hidden transition-transform active:scale-95 disabled:opacity-70"
                style={{ background: '#0D2B45', border: '1px solid rgba(255,255,255,0.15)' }}
                {...fadeUp(1.3, 10)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className="relative z-10">{t('cover.cta')}</span>
                <span className="relative z-10 text-base">✉</span>
                <span className="absolute inset-0 bg-white/10 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
