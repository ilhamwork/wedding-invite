import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'
import { BrushDivider } from './ui/Ornaments'

function PersonCard({ person, roleLabel }) {
  return (
    <div className="text-center">
      <div className="w-40 h-48 mx-auto rounded-[3rem] rounded-tr-md overflow-hidden border hairline mb-5 bg-sand/50">
        <img
          src={person.photo}
          alt={`${person.fullName} — TODO: replace with real photo`}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <p className="section-label mb-1">{roleLabel}</p>
      <h3 className="font-display text-2xl text-ink">{person.fullName}</h3>
      {person.instagram && (
        <p className="text-xs text-sage-deep mt-1 tracking-wide">{person.instagram}</p>
      )}
    </div>
  )
}

export default function Couple() {
  const { t } = useTranslation()
  return (
    <Section id="couple">
      <Reveal>
        <Eyebrow>{t('couple.eyebrow')}</Eyebrow>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 mt-8">
          <PersonCard person={content.couple.groom} roleLabel={t('couple.groom')} />
          <PersonCard person={content.couple.bride} roleLabel={t('couple.bride')} />
        </div>
        <BrushDivider className="w-32 h-4 mx-auto mt-12" />
      </Reveal>
    </Section>
  )
}
