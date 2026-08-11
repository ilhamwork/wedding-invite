import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

function EventItem({ event, label, note, timeOverride }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const date = new Date(event.dateISO)
  const dateFormatted = date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const timeFormatted = timeOverride ?? date.toLocaleTimeString(lang === 'id' ? 'id-ID' : 'en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <div className="text-center py-2">
      <p className="section-label text-[14px] tracking-widest mb-2">{label}</p>
      {note && (
        <p className="font-body text-[11px] tracking-widest uppercase text-amber-700 mb-2">
          {note}
        </p>
      )}
      <p className="font-display text-xl text-sea mb-1">{dateFormatted}</p>
      <p className="font-display text-lg text-sea-light">{timeFormatted} WIB</p>
    </div>
  )
}

export default function EventDetails() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <Section id="event" bg="texture" flip={false} fadeTop="#F7F4ED" fadeBottom="#F7F4ED">
      <Reveal variant="fadeUp">
        <h2 className="font-display text-2xl text-center text-sea mb-10">{t('event.title')}</h2>

        {/* Event Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-10 max-w-4xl mx-auto">
          {/* Akad Card */}
          <div className="bg-pebble/30 rounded-2xl p-6 border hairline flex flex-col justify-center">
            <EventItem
              event={content.event.akad}
              label={content.event.akad.label[lang]}
              note={lang === 'id' ? 'Khusus keluarga' : 'Reserved for family only'}
            />
          </div>

          {/* Resepsi Card */}
          <div className="bg-pebble/30 rounded-2xl p-6 border hairline flex flex-col justify-center">
            <EventItem
              event={content.event.resepsi}
              label={content.event.resepsi.label[lang]}
              timeOverride="18:30 - 21:00"
            />
          </div>
        </div>

        {/* Venue address & Map button */}
        <div className="mt-8 text-center max-w-md mx-auto">
          <p className="section-label text-[14px] tracking-widest mb-2">
            {lang === 'id' ? 'Lokasi' : 'Venue'}
          </p>
          <p className="text-sm md:text-base text-sea-light leading-relaxed mb-6 whitespace-pre-line">
            {content.event.akad.address}
          </p>
          <a
            href={content.event.map.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full bg-accent text-ink text-xs tracking-[0.2em] uppercase hover:bg-accent-mid transition-colors font-medium shadow-sm"
          >
            {t('event.viewMap')}
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
