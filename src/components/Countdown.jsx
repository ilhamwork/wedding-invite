import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { content } from '../config/content.config'
import useCountdown from '../hooks/useCountdown'

const ease = [0.22, 1, 0.36, 1]
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 1.6, ease, delay },
})

function pad(n) {
  return String(n).padStart(2, '0')
}

function buildGoogleCalendarUrl() {
  const start = new Date(content.event.akad.dateISO)
  const end = new Date(content.event.resepsi.dateISO)
  end.setHours(end.getHours() + 2)
  const fmt = (d) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `Wedding of ${content.couple.groom.nickname} & ${content.couple.bride.nickname}`,
    dates: `${fmt(start)}/${fmt(end)}`,
    location: content.event.akad.venueName,
    details: `${content.event.akad.label.en} & ${content.event.resepsi.label.en}`,
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

export default function Countdown() {
  const { t, i18n } = useTranslation()
  const { total, days, hours, minutes, seconds } = useCountdown(content.event.akad.dateISO)

  const units = [
    { label: t('countdown.days'),    value: days },
    { label: t('countdown.hours'),   value: hours },
    { label: t('countdown.minutes'), value: minutes },
    { label: t('countdown.seconds'), value: seconds },
  ]

  // Format wedding date
  const weddingDate = new Date(content.event.akad.dateISO)
  const dateLabel = weddingDate.toLocaleDateString(
    i18n.language === 'id' ? 'id-ID' : 'en-GB',
    { day: '2-digit', month: 'long', year: 'numeric' }
  )

  const carouselImages = content.countdown?.images ?? content.gallery.map((g) => g.src)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % carouselImages.length)
    }, content.countdown?.slideDuration ?? 3500)
    return () => clearInterval(interval)
  }, [carouselImages.length])

  return (
    <section
      id="countdown"
      className="relative w-full overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── Background carousel ── */}
      <AnimatePresence>
        <motion.img
          key={carouselImages[activeIdx]}
          src={carouselImages[activeIdx]}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />
      </AnimatePresence>

      {/* ── Dark overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)',
        }}
      />

      {/* ── Main content ── */}
      <div
        className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center"
        style={{ minHeight: '100svh', paddingBottom: '55vh' }}
      >
        <motion.p
          className="font-body text-[12px] sm:text-xs tracking-widest font-bold uppercase text-white/70 mb-4 leading-relaxed"
          {...fadeUp(0.3)}
        >
          You are invited to witness<br />and celebrate our special day
        </motion.p>

        {/* Thin divider */}
        <motion.div className="flex items-center gap-3" {...fadeUp(0.7)}>
          <div className="h-px w-10 bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-amber-200/60" />
          <div className="h-px w-10 bg-white/30" />
        </motion.div>
      </div>

      {/* ── Countdown bar ── */}
      <motion.div
        className="absolute left-4 right-4 z-20"
        style={{ top: '75%', transform: 'translateY(-50%)' }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease, delay: 1.0 }}
      >
        <div
          className="w-full rounded-2xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.04) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.30)',
          }}
        >
          <div className="max-w-lg mx-auto px-5 py-4 flex flex-col items-center gap-3">
            <div className="flex items-center gap-3">
              <p className="font-display text-sm text-white whitespace-nowrap">{dateLabel}</p>
              <div className="w-px h-3 bg-white/20" />
              <a
                href={buildGoogleCalendarUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="font-body text-[9px] tracking-[0.12em] uppercase text-amber-200/70 hover:text-amber-200 transition-colors whitespace-nowrap"
              >
                + {t('countdown.addToCalendar')}
              </a>
            </div>

            <div className="w-full h-px bg-white/10" />

            {total > 0 ? (
              <div className="flex gap-5 sm:gap-8">
                {units.map((u) => (
                  <div key={u.label} className="text-center">
                    <p className="font-display text-3xl sm:text-4xl text-white/80 tabular-nums leading-none">
                      {pad(u.value)}
                    </p>
                    <p className="font-body text-[9px] tracking-[0.15em] uppercase text-white/50 mt-1">
                      {u.label}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="font-display text-base text-amber-200">
                {t('countdown.happening')}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
