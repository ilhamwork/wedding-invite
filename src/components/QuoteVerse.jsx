import { useTranslation } from 'react-i18next'
import { Reveal } from './ui/Section'

const QUOTE = {
  ar: 'وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً',
  id: '"Dan di antara tanda-tanda kebesaran-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang."',
  en: '"And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought."',
  source: 'QS. Ar-Rum: 21',
}

export default function QuoteVerse() {
  const { i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <section id="verse" className="relative" style={{ backgroundColor: '#EEE9DE' }}>
      <div className="relative px-6 py-20 sm:py-24 max-w-xl mx-auto text-center">
        <div className="max-w-sm mx-auto py-4">

          {/* Arabic */}
          <Reveal variant="fadeIn">
            <p
              className="font-display text-xl leading-loose mb-6 tracking-wide"
              style={{ direction: 'rtl', color: '#2E3A4F' }}
            >
              {QUOTE.ar}
            </p>
          </Reveal>

          {/* Divider */}
          <Reveal delay={0.15} variant="fadeIn">
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="block w-10 h-px" style={{ backgroundColor: 'rgba(2,68,67,0.25)' }} />
              <span className="block w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'rgba(201,169,110,0.80)' }} />
              <span className="block w-10 h-px" style={{ backgroundColor: 'rgba(2,68,67,0.25)' }} />
            </div>
          </Reveal>

          {/* Translation */}
          <Reveal delay={0.3} variant="fadeIn">
            <p
              className="font-serif-light italic text-base leading-relaxed mb-5 tracking-tight"
              style={{ color: 'rgba(74,95,122,0.85)' }}
            >
              {QUOTE[lang]}
            </p>
          </Reveal>

          {/* Source */}
          <Reveal delay={0.45} variant="fadeIn">
            <p
              className="font-body font-bold text-xs tracking-[0.25em] uppercase"
              style={{ color: 'rgba(201,169,110,0.90)' }}
            >
              {QUOTE.source}
            </p>
          </Reveal>

        </div>
      </div>
    </section>
  )
}
