import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import LanguageToggle from './LanguageToggle'
import { useAudio } from '../context/AudioContext'

// ─── Animation helpers ─────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]
const fadeUp  = (delay = 0, y = 20)   => ({ initial: { opacity: 0, y },        animate: { opacity: 1, y: 0 },    transition: { duration: 0.8, ease, delay } })
const fadeIn  = (delay = 0, dur = 1)  => ({ initial: { opacity: 0 },            animate: { opacity: 1 },          transition: { duration: dur,  ease, delay } })
const scaleFd = (delay = 0)           => ({ initial: { opacity: 0, scale: .88 },animate: { opacity: 1, scale: 1 },transition: { duration: 0.9, ease, delay } })
const slideX  = (delay = 0, x = -30)  => ({ initial: { opacity: 0, x },         animate: { opacity: 1, x: 0 },    transition: { duration: 0.9, ease, delay } }) // eslint-disable-line no-unused-vars

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
          background: 'linear-gradient(160deg, #CBE8F8 0%, #7DC0E8 30%, #3A8EC0 65%, #1D5478 100%)',
        }}
        exit={{ opacity: 0, transition: { duration: 0.7, delay: 0.2 } }}
      >
        {/* Light overlay — di depan background, di belakang semua konten */}
        <div className="absolute inset-0 z-1 bg-gradient-to-b from-white/80 via-white/50 to-white/25" />

        {/* Subtle noise texture */}
        <div className="absolute inset-0 z-[3] opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />




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
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-8 pb-8 pt-16">

              {/* Eyebrow */}
              <motion.p
                className="font-body text-[11px] tracking-[0.30em] uppercase text-slate-600 mb-6"
                {...fadeUp(0.7, 14)}
              >
                {t('cover.eyebrow')}
              </motion.p>

              {/* Invited to + guest name */}
              <motion.p
                className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-1"
                {...fadeIn(0.85)}
              >
                {t('cover.invitedTo')}
              </motion.p>
              <motion.p
                className="font-display text-lg text-slate-800 mb-8"
                {...fadeUp(0.95, 12)}
              >
                {guestName || t('cover.fallbackGuest')}
              </motion.p>

              {/* Divider */}
              <motion.div
                className="flex items-center gap-3 mb-5 w-full justify-center"
                {...fadeIn(1.05)}
              >
                <span className="block flex-1 max-w-[40px] h-px bg-slate-400/50" />
                <span className="block w-1 h-1 rounded-full bg-slate-400" />
                <span className="block flex-1 max-w-[40px] h-px bg-slate-400/50" />
              </motion.div>

              {/* Invite copy */}
              <motion.p
                className="font-body text-[11px] tracking-[0.12em] text-slate-500 mb-3"
                {...fadeIn(1.1)}
              >
                We invite you to The Wedding of
              </motion.p>

              {/* Names */}
              <motion.h1
                className="font-display text-3xl sm:text-4xl text-slate-800 leading-snug drop-shadow-sm mb-10"
                {...fadeUp(1.2, 18)}
              >
                {content.couple.groom.nickname}
                <span className="font-script text-2xl text-slate-500 mx-2">&amp;</span>
                {content.couple.bride.nickname}
              </motion.h1>

              {/* CTA button */}
              <motion.button
                type="button"
                onClick={handleOpen}
                disabled={isOpening}
                className="group relative flex items-center gap-2 px-7 py-3 rounded-full text-white font-body text-xs tracking-[0.20em] uppercase overflow-hidden transition-transform active:scale-95 disabled:opacity-70 shadow-lg shadow-black/20"
                style={{ background: '#0D4A7A', border: '1px solid rgba(255,255,255,0.25)' }}
                {...fadeUp(1.5, 10)}
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
