import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'
import { BrushDivider } from './ui/Ornaments'

export default function Hero() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const date = new Date(content.event.akad.dateISO)
  const dateFormatted = date.toLocaleDateString(lang === 'id' ? 'id-ID' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Section id="hero">
      <Reveal className="text-center">
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>
        <h2 className="font-display text-3xl sm:text-4xl text-ink leading-snug mb-3">
          {content.couple.groom.fullName}
          <span className="block font-script text-2xl text-rust my-2">&amp;</span>
          {content.couple.bride.fullName}
        </h2>
        <BrushDivider className="w-32 h-4 mx-auto my-6" />
        <blockquote className="font-serif-light italic text-ink-soft/85 text-[15px] leading-relaxed max-w-xs mx-auto">
          {content.hero.quote[lang]}
        </blockquote>
        <p className="text-xs text-ink-soft/50 mt-3 tracking-wide">{content.hero.quote.source}</p>
        <p className="mt-10 font-display text-xl text-rust">{dateFormatted}</p>
      </Reveal>
    </Section>
  )
}
