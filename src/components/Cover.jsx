import { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import LanguageToggle from './LanguageToggle'
import { useAudio } from '../context/AudioContext'

// ─── Animation helpers ─────────────────────────────────────────────────────────
const ease = [0.22, 1, 0.36, 1]
const fadeUp  = (delay = 0, y = 60)    => ({ initial: { opacity: 0, y },         animate: { opacity: 1, y: 0 },    transition: { duration: 1.8, ease, delay } })
const fadeIn  = (delay = 0, dur = 1.8) => ({ initial: { opacity: 0 },             animate: { opacity: 1 },          transition: { duration: dur,  ease, delay } })
const scaleFd = (delay = 0)            => ({ initial: { opacity: 0, scale: .92 }, animate: { opacity: 1, scale: 1 },transition: { duration: 1.8, ease, delay } })

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
        {/* ── Full-bleed background photo — mobile uses portrait, desktop uses landscape ── */}
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

        {/* ── Dark overlay — bold agar kesan "undangan belum dibuka" ── */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)',
          }}
        />

        {/* ── Subtle vignette di tepi ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow: 'inset 0 0 120px 40px rgba(0,0,0,0.50)',
          }}
        />

        {/* Language toggle — hidden */}
        {/* <motion.div className="absolute top-5 right-5 z-20" {...fadeIn(1.6)}>
          <LanguageToggle />
        </motion.div> */}

        {/* ── Centre content ── */}
        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center px-6"
          animate={isOpening ? { y: -40, opacity: 0 } : {}}
          transition={{ duration: 0.8, ease }}
        >
          <motion.div
            className="relative w-full flex flex-col items-center text-center"
            {...scaleFd(0.3)}
          >
            {/* Thin decorative line */}
            <motion.div
              className="w-px bg-white/30 mb-6"
              style={{ height: 48 }}
              {...fadeIn(0.5)}
            />

            {/* Eyebrow */}
            <motion.p
              className="font-body text-[11px] tracking-[0.30em] uppercase text-white/60 mb-5"
              {...fadeIn(0.7)}
            >
              We invite you<br />to The Wedding of
            </motion.p>

            {/* Names */}
            <motion.h1
              className="font-display text-5xl sm:text-6xl text-white leading-tight mb-3 drop-shadow-lg"
              {...fadeUp(0.9, 18)}
            >
              {content.couple.bride.nickname}
              <span className="font-script text-4xl text-amber-200/80 mx-3">&amp;</span>
              {content.couple.groom.nickname}
            </motion.h1>

            {/* Divider ornament */}
            <motion.div
              className="flex items-center gap-3 my-5"
              {...fadeIn(1.1)}
            >
              <div className="h-px w-12 bg-white/30" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-200/60" />
              <div className="h-px w-12 bg-white/30" />
            </motion.div>

            {/* Dear guest */}
            {guestName && (
              <motion.div className="mb-6" {...fadeIn(1.2)}>
                <p className="font-body text-[11px] tracking-[0.25em] uppercase text-white/50 mb-1">
                  {t('cover.invitedTo')}
                </p>
                <p className="font-display text-xl sm:text-2xl text-white/90">
                  {guestName}
                </p>
              </motion.div>
            )}

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
              {...fadeUp(1.4, 10)}
              whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.20)' }}
              whileTap={{ scale: 0.96 }}
            >
              <span className="text-base">✉</span>
              <span>{t('cover.cta')}</span>
            </motion.button>

            {/* Bottom line */}
            <motion.div
              className="w-px bg-white/30 mt-6"
              style={{ height: 48 }}
              {...fadeIn(1.6)}
            />
          </motion.div>
        </motion.div>
    </motion.div>
  )
}
