import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

export default function OurStory() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <Section id="story">
      <Eyebrow>{t('story.eyebrow')}</Eyebrow>
      <h2 className="font-display text-2xl text-center text-ink mb-10">{t('story.title')}</h2>

      <ol className="relative border-l hairline ml-3 space-y-10">
        {content.story.map((item, i) => (
          <Reveal as="li" key={item.year} delay={i * 0.08} className="relative pl-8">
            <span className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-rust ring-4 ring-cream" />
            <p className="font-display text-lg text-rust mb-1">{item.year}</p>
            <p className="font-display text-lg text-ink mb-1">{item.title[lang]}</p>
            <p className="text-sm text-ink-soft/80 leading-relaxed">{item.text[lang]}</p>
          </Reveal>
        ))}
      </ol>
    </Section>
  )
}
