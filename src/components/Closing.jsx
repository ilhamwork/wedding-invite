import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

// Format event date — e.g. "05 September 2026"
function formatEventDate(isoString) {
  const date = new Date(isoString)
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
}

export default function Closing() {
  const { t } = useTranslation()
  const eventDate = formatEventDate(content.event.akad.dateISO)

  return (
    <div id="closing">
      <Section className="pb-4" bg="sky" fadeTop="#EEE9DE">
        <Reveal variant="fadeIn" className="text-center">
          {/* Original closing message */}
          <p className="text-sm text-sea-light leading-relaxed max-w-xs mx-auto mb-3">
            {t('closing.message')}
          </p>

          {/* Couple names */}
          <h2 className="font-script text-4xl text-sea mb-3">
            {content.couple.bride.nickname} &amp; {content.couple.groom.nickname}
          </h2>

          {/* Slogan */}
          <p className="font-body text-xs tracking-[0.22em] uppercase text-sea-light/55">
            more (s)miles together
          </p>
        </Reveal>
      </Section>

      {/* Full-bleed half photo */}
      {content.closing?.photo && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '55vw', maxHeight: 400, backgroundColor: '#EEE9DE' }}
        >
          <img
            src={content.closing.photo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #EEE9DE 0%, rgba(238,233,222,0.5) 35%, transparent 100%)',
            }}
          />
        </div>
      )}
    </div>
  )
}
