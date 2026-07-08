import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import useCountdown from '../hooks/useCountdown'
import Section, { Reveal, Eyebrow } from './ui/Section'

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
  const { t } = useTranslation()
  const { total, days, hours, minutes, seconds } = useCountdown(content.event.akad.dateISO)

  const units = [
    { label: t('countdown.days'), value: days },
    { label: t('countdown.hours'), value: hours },
    { label: t('countdown.minutes'), value: minutes },
    { label: t('countdown.seconds'), value: seconds },
  ]

  return (
    <Section id="countdown">
      <Reveal className="text-center">
        <h2 className="font-display text-2xl text-ink mb-8">{t('countdown.title')}</h2>

        {total > 0 ? (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-sm mx-auto mb-8">
            {units.map((u) => (
              <div key={u.label} className="rounded-2xl border hairline py-4 bg-pebble/60">
                <p className="font-display text-2xl sm:text-3xl text-sea-light tabular-nums">
                  {pad(u.value)}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-ink-soft/70 mt-1">
                  {u.label}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-display text-xl text-sea-light">{t('countdown.happening')}</p>
        )}

        <a
          href={buildGoogleCalendarUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2.5 rounded-full border hairline text-ink text-xs tracking-[0.2em] uppercase hover:bg-sea hover:text-cream transition-colors"
        >
          {t('countdown.addToCalendar')}
        </a>
      </Reveal>
    </Section>
  )
}
