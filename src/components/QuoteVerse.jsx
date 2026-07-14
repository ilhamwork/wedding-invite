import { useTranslation } from 'react-i18next'
import { Reveal } from './ui/Section'

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
    <section id="verse" className="relative" style={{ backgroundColor: '#2E3A4F' }}>
      <div className="relative px-6 py-20 sm:py-24 max-w-xl mx-auto text-center">
        <div className="max-w-sm mx-auto py-4">

          {/* Arabic */}
          <Reveal variant="fadeIn">
            <p
              className="font-display text-xl leading-loose mb-6 tracking-wide"
              style={{ direction: 'rtl', color: '#F7F4ED' }}
            >
              {QUOTE.ar}
            </p>
          </Reveal>

          {/* Divider */}
          <Reveal delay={0.15} variant="fadeIn">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="block w-10 h-px" style={{ backgroundColor: 'rgba(247,244,237,0.30)' }} />
              <span className="block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,169,110,0.70)' }} />
              <span className="block w-10 h-px" style={{ backgroundColor: 'rgba(247,244,237,0.30)' }} />
            </div>
          </Reveal>

          {/* Translation */}
          <Reveal delay={0.3} variant="fadeIn">
            <p
              className="font-serif-light italic text-base leading-relaxed mb-5"
              style={{ color: 'rgba(247,244,237,0.85)' }}
            >
              {QUOTE[lang]}
            </p>
          </Reveal>

          {/* Source */}
          <Reveal delay={0.45} variant="fadeIn">
            <p
              className="font-body text-xs tracking-[0.25em] uppercase"
              style={{ color: 'rgba(201,169,110,0.80)' }}
            >
              {QUOTE.source}
            </p>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
