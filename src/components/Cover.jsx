import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import LanguageToggle from './LanguageToggle'
import { LeafMonogram, FloatingLeaf } from './ui/Ornaments'
import { useAudio } from '../context/AudioContext'

export default function Cover({ guestName, onOpen }) {
  const { t } = useTranslation()
  const [isOpening, setIsOpening] = useState(false)
  const { unlockAndPlay } = useAudio()

  function handleOpen() {
    if (isOpening) return
    setIsOpening(true)
    unlockAndPlay()
    // Let the envelope animation play before revealing the main site.
    setTimeout(() => {
      onOpen()
    }, 1100)
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 paper-texture flex flex-col items-center justify-between overflow-hidden"
        exit={{ opacity: 0, transition: { duration: 0.6, delay: 0.3 } }}
      >
        {/* ambient floating leaves */}
        {[...Array(6)].map((_, i) => (
          <FloatingLeaf
            key={i}
            className="absolute w-6 h-6 pointer-events-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${-10 - i * 4}%`,
              animation: `drift-${i % 2} ${9 + i}s linear ${i * 1.3}s infinite`,
            }}
          />
        ))}
        <style>{`
          @keyframes drift-0 { to { transform: translateY(120vh) translateX(20px) rotate(180deg); opacity: 0; } }
          @keyframes drift-1 { to { transform: translateY(120vh) translateX(-20px) rotate(-180deg); opacity: 0; } }
        `}</style>

        <div className="w-full flex justify-end p-5">
          <LanguageToggle />
        </div>

        {/* envelope flap animation */}
        <motion.div
          className="flex-1 flex flex-col items-center justify-center text-center px-8 max-w-sm"
          animate={isOpening ? { y: -40, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <LeafMonogram className="w-16 h-16 mb-6" />
          <p className="section-label mb-4">{t('cover.eyebrow')}</p>
          <h1 className="font-script text-5xl sm:text-6xl text-ink leading-tight mb-2">
            {content.couple.groom.nickname} &amp; {content.couple.bride.nickname}
          </h1>
          <p className="font-serif-light italic text-ink-soft/80 text-sm mb-10">
            05 . 09 . 2026
          </p>

          <div className="w-full border-t border-b hairline py-5 mb-10">
            <p className="text-xs uppercase tracking-[0.2em] text-ink-soft/70 mb-1">
              {t('cover.invitedTo')}
            </p>
            <p className="font-display text-2xl text-ink">
              {guestName || t('cover.fallbackGuest')}
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpen}
            disabled={isOpening}
            className="group relative px-8 py-3 rounded-full bg-ink text-cream font-body text-xs tracking-[0.25em] uppercase overflow-hidden transition-transform active:scale-95 disabled:opacity-70"
          >
            <span className="relative z-10">{t('cover.cta')}</span>
            <span className="absolute inset-0 bg-rust scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-300" />
          </button>
        </motion.div>

        <div className="h-10" />
      </motion.div>
    </AnimatePresence>
  )
}
