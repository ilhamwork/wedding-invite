import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

function EventItem({ event, label, note, timeOverride }) {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const date = new Date(event.dateISO)
  const dateFormatted = date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
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
      <p className="section-label mb-2">{label}</p>
      {note && (
        <p className="font-body text-[10px] tracking-[0.2em] uppercase text-amber-700/70 mb-2">
          {note}
        </p>
      )}
      <p className="font-display text-xl text-ink mb-1">{dateFormatted}</p>
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
        <h2 className="font-display text-2xl text-center text-ink mb-10">{t('event.title')}</h2>

        {/* Akad */}
        <EventItem
          event={content.event.akad}
          label={content.event.akad.label[lang]}
          note={lang === 'id' ? 'Khusus keluarga' : 'Reserved for family only'}
        />

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 my-6">
          <div className="h-px w-12 bg-ink/10" />
          <div className="w-1 h-1 rounded-full bg-ink/20" />
          <div className="h-px w-12 bg-ink/10" />
        </div>

        {/* Resepsi */}
        <EventItem
          event={content.event.resepsi}
          label={content.event.resepsi.label[lang]}
          timeOverride="18:30 - 21:00"
        />

        {/* Venue address */}
        <div className="mt-8 mb-8 text-center">
          <p className="font-body text-[10px] tracking-[0.2em] uppercase text-ink-soft/50 mb-2">
            {lang === 'id' ? 'Lokasi' : 'Venue'}
          </p>
          <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto">
            {content.event.akad.address}
          </p>
        </div>

        {/* Map button */}
        <div className="text-center">
          <a
            href={content.event.map.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 rounded-full bg-accent text-ink text-xs tracking-[0.2em] uppercase hover:bg-accent-mid transition-colors font-medium"
          >
            {t('event.viewMap')}
          </a>
        </div>
      </Reveal>
    </Section>
  )
}
