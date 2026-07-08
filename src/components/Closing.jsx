import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

export default function Closing() {
  const { t } = useTranslation()
  return (
    <Section id="closing" className="pb-28" bg="sky" fadeTop="#CBE8F8">
      <Reveal variant="fadeIn" className="text-center">
        <p className="section-label mb-3">{t('closing.thankYou')}</p>
        <h2 className="font-script text-4xl text-ink mb-4">
          {content.couple.groom.nickname} &amp; {content.couple.bride.nickname}
        </h2>
        <p className="text-sm text-ink-soft/75 leading-relaxed max-w-xs mx-auto">
          {t('closing.message')}
        </p>
      </Reveal>
    </Section>
  )
}
