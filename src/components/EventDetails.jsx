import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

function EventCard({ event, label }) {
  const { t, i18n } = useTranslation()
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
  })

  return (
    <div className="rounded-3xl border hairline p-6 bg-paper/50 text-center">
      <p className="section-label mb-3">{label}</p>
      <p className="font-display text-xl text-ink mb-1">{dateFormatted}</p>
      <p className="font-display text-lg text-rust mb-4">{timeFormatted} WIB</p>
      <p className="text-sm text-ink-soft/80 leading-relaxed mb-4">{event.address}</p>
      <a
        href={content.event.map.googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-5 py-2 rounded-full bg-ink text-cream text-xs tracking-[0.2em] uppercase hover:bg-rust transition-colors"
      >
        {t('event.viewMap')}
      </a>
    </div>
  )
}

export default function EventDetails() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const { lat, lng } = content.event.map

  return (
    <Section id="event">
      <Reveal>
        <Eyebrow>{t('event.eyebrow')}</Eyebrow>
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('event.title')}</h2>

        <div className="space-y-6">
          <EventCard event={content.event.akad} label={content.event.akad.label[lang]} />
          <EventCard event={content.event.resepsi} label={content.event.resepsi.label[lang]} />
        </div>

        <div className="mt-8 rounded-3xl overflow-hidden border hairline h-56">
          {/* TODO: replace lat/lng with exact coordinates once confirmed */}
          <iframe
            title="Venue map"
            src={`https://www.google.com/maps?q=${lat},${lng}&z=16&output=embed`}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Reveal>
    </Section>
  )
}
