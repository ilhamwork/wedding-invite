import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { useAudio } from '../context/AudioContext'

export default function MusicToggle() {
  const { t } = useTranslation()
  const { isPlaying, toggle } = useAudio()

  return (
    <motion.button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? t('music.pause') : t('music.play')}
      className="fixed bottom-5 right-5 z-40 w-11 h-11 rounded-full bg-sea text-cream shadow-lg shadow-sea/20 flex items-center justify-center hover:bg-sea-mid transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="relative flex items-center justify-center gap-[2px]">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-[2.5px] bg-cream rounded-full"
            style={{
              height: isPlaying ? '10px' : '6px',
              animation: isPlaying ? `music-bar 0.9s ease-in-out ${i * 0.15}s infinite` : 'none',
            }}
          />
        ))}
      </span>
      <style>{`
        @keyframes music-bar {
          0%, 100% { height: 5px; }
          50% { height: 14px; }
        }
      `}</style>
    </motion.button>
  )
}
