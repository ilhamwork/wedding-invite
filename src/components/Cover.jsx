import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import { useAudio } from '../context/AudioContext'

// ─── Animation helpers ─────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]
const fadeUp  = (delay = 0, y = 60)    => ({ initial: { opacity: 0, y },         animate: { opacity: 1, y: 0 },    transition: { duration: 1.8, ease, delay } })
const fadeIn  = (delay = 0, dur = 1.8) => ({ initial: { opacity: 0 },             animate: { opacity: 1 },          transition: { duration: dur,  ease, delay } })

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
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1, ease } }}
    >
      {/* ── Full-bleed background photo ── */}
      <style>{`
        .cover-bg {
          background-image: url('${content.cover.photo}');
          background-position: center top;
        }
        @media (min-width: 768px) {
          .cover-bg {
            background-image: url('${content.cover.photoDesktop ?? content.cover.photo}');
            background-position: center center;
          }
        }
      `}</style>
      <motion.div
        className="cover-bg absolute inset-0"
        style={{ backgroundSize: 'cover' }}
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.1 }}
        transition={{ duration: 1.5, ease }}
      />

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)',
        }}
      />

      {/* ── Subtle vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.50)' }}
      />

      {/* ── TOP: "The Wedding of Couple" ── */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-10 flex flex-col items-center pt-10 px-6 text-center"
        animate={isOpening ? { y: -30, opacity: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        <motion.p
          className="font-body text-[10px] tracking-[0.28em] uppercase text-white/55 mb-2"
          {...fadeIn(0.4)}
        >
          The Wedding of
        </motion.p>
        <motion.h2
          className="font-display text-3xl sm:text-4xl text-white drop-shadow-lg leading-tight"
          {...fadeUp(0.6, 12)}
        >
          {content.couple.bride.nickname}
          <span className="font-script text-2xl text-amber-200/80 mx-2">&amp;</span>
          {content.couple.groom.nickname}
        </motion.h2>
      </motion.div>

      {/* ── BOTTOM: Dear guest + Open button ── */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-10 flex flex-col items-center pb-12 px-6 text-center"
        animate={isOpening ? { y: 30, opacity: 0 } : {}}
        transition={{ duration: 0.8, ease }}
      >
        {/* Dear guest — always shown, fallback to generic text */}
        <motion.div className="mb-5" {...fadeIn(1.0)}>
          <p className="font-body text-[10px] tracking-[0.28em] uppercase text-white/50 mb-1">
            Dear
          </p>
          <p className="font-display text-xl sm:text-2xl text-white/90">
            {guestName || t('cover.fallbackGuest')}
          </p>
        </motion.div>

        {/* CTA button */}
        <motion.button
          type="button"
          onClick={handleOpen}
          disabled={isOpening}
          className="group relative flex items-center gap-2.5 px-8 py-3.5 rounded-full font-body text-[11px] tracking-[0.22em] uppercase overflow-hidden transition-transform active:scale-95 disabled:opacity-60"
          style={{
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.35)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
          }}
          {...fadeUp(1.2, 10)}
          whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.20)' }}
          whileTap={{ scale: 0.96 }}
        >
          <span className="text-base">✉</span>
          <span>{t('cover.cta')}</span>
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
