import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

export default function Closing() {
  const { t } = useTranslation()
  return (
    <div id="closing">
      {/* ── Text content inside normal Section padding ── */}
      <Section className="pb-4" bg="sky" fadeTop="#EAE5D8">
        <Reveal variant="fadeIn" className="text-center">
          <p className="section-label mb-3">{t('closing.thankYou')}</p>
          <h2 className="font-script text-4xl text-ink mb-4">
            {content.couple.bride.nickname} &amp; {content.couple.groom.nickname}
          </h2>
          <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto">
            {t('closing.message')}
          </p>
        </Reveal>
      </Section>

      {/* ── Full-bleed half photo with fade top edge ── */}
      {content.closing?.photo && (
        <div
          className="relative w-full overflow-hidden"
          style={{ height: '55vw', maxHeight: 400, backgroundColor: '#EAE5D8' }}
        >
          <img
            src={content.closing.photo}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 w-full h-full object-cover object-top"
          />
          {/* Fade from section bg colour → transparent, top ~40% */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(to bottom, #EAE5D8 0%, rgba(234,229,216,0.5) 35%, transparent 100%)',
            }}
          />
        </div>
      )}
    </div>
  )
}
