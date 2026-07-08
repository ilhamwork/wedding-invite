import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

function EventCard({ event, label }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const date = new Date(event.dateISO)
  const dateFormatted = date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeFormatted = date.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="rounded-3xl border hairline p-6 bg-pebble/50 text-center">
      <p className="section-label mb-3">{label}</p>
      <p className="font-display text-xl text-ink mb-1">{dateFormatted}</p>
      <p className="font-display text-lg text-sea-light mb-4">{timeFormatted} WIB</p>
      <p className="text-sm text-ink-soft/80 leading-relaxed">{event.address}</p>
    </div>
  )
}

export default function EventDetails() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <Section id="event" bg="texture" flip={false} fadeTop="#EDF6FD" fadeBottom="#EDF6FD">
      <Reveal variant="slideLeft">
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('event.title')}</h2>

        <div className="space-y-6 mb-8">
          <EventCard event={content.event.akad} label={content.event.akad.label[lang]} />
          <EventCard event={content.event.resepsi} label={content.event.resepsi.label[lang]} />
        </div>

        {/* Single map button for both events — same venue */}
        <div className="text-center">
          <a
            href={content.event.map.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full bg-sea text-cream text-xs tracking-[0.2em] uppercase hover:bg-sea-mid transition-colors"
          >
            {t('event.viewMap')}
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
