import { useTranslation } from 'react-i18next'
import Section, { Reveal } from './ui/Section'

const QUOTE = {
  ar: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  id: '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."',
  en: '"And among His Signs is this, that He created for you mates from among yourselves, that you may dwell in tranquility with them, and He has put love and mercy between your hearts."',
  source: 'QS. Ar-Rum: 21',
}

export default function QuoteVerse() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <Section id="verse" bg="texture" flip={true} fadeTop="#EDF6FD" fadeBottom="#EDF6FD">
      <div className="text-center max-w-sm mx-auto py-4">

        {/* Arabic */}
        <Reveal variant="fadeIn">
          <p
            className="font-display text-xl text-sea leading-loose mb-6 tracking-wide"
            style={{ direction: 'rtl' }}
          >
            {QUOTE.ar}
          </p>
        </Reveal>

        {/* Divider */}
        <Reveal delay={0.15} variant="fadeIn">
          <div className="flex items-center justify-center gap-3 mb-6">
            <span className="block w-10 h-px bg-sea-light/40" />
            <span className="block w-1.5 h-1.5 rounded-full bg-sea-light/50" />
            <span className="block w-10 h-px bg-sea-light/40" />
          </div>
        </Reveal>

        {/* Translation */}
        <Reveal delay={0.3} variant="fadeIn">
          <p className="font-serif-light italic text-base text-ink-soft/90 leading-relaxed mb-5">
            {QUOTE[lang]}
          </p>
        </Reveal>

        {/* Source */}
        <Reveal delay={0.45} variant="fadeIn">
          <p className="font-body text-xs tracking-[0.25em] uppercase text-sea-light/80">
            {QUOTE.source}
          </p>
        </Reveal>

      </div>
    </Section>
  )
}
