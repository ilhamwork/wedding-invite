import { useTranslation } from 'react-i18next'
import { useAudio } from '../context/AudioContext'

export default function MusicToggle() {
  const { t } = useTranslation()
  const { isPlaying, toggle } = useAudio()

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isPlaying ? t('music.pause') : t('music.play')}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 9999,
        width: '3rem',
        height: '3rem',
        borderRadius: '9999px',
        backgroundColor: 'var(--color-accent)',
        color: 'var(--color-ink)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
      }}
    >
      <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            style={{
              display: 'block',
              width: '2.5px',
              borderRadius: '9999px',
              backgroundColor: 'var(--color-ink)',
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
    </button>
  )
}
