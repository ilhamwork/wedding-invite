import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

// Placeholder image shown when no photo is provided
const PLACEHOLDER = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 3"%3E%3Crect width="4" height="3" fill="%23d6e4e9"/%3E%3C/svg%3E'

export default function OurStory() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const items = content.story
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent((c) => (c - 1 + items.length) % items.length)
  const next = () => setCurrent((c) => (c + 1) % items.length)

  const item = items[current]

  return (
    <Section id="story" bg="sky" fadeTop="#CBE8F8" fadeBottom="#CBE8F8">
      <Reveal>
        <h2 className="font-display text-2xl text-center text-ink mb-8">
          {t('story.title')}
        </h2>
      </Reveal>

      <Reveal variant="scaleUp" delay={0.1} className="relative select-none">
        {/* Card */}
        <div className="rounded-2xl overflow-hidden border border-sea-light/30 bg-mist/60 shadow-md">
          {/* Photo */}
          <div className="relative w-full aspect-4/3 overflow-hidden bg-sea-light/10">
            <img
              key={current}
              src={item.photo ?? PLACEHOLDER}
              alt={item.title[lang]}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
            {/* Year badge */}
            <span className="absolute top-3 left-3 font-display text-sm text-white bg-sea-dark/60 backdrop-blur-sm px-3 py-1 rounded-full">
              {item.year}
            </span>
          </div>

          {/* Caption */}
          <div className="px-5 py-4">
            <p className="font-display text-base text-ink mb-1">{item.title[lang]}</p>
            <p className="text-sm text-ink-soft/80 leading-relaxed">{item.caption[lang]}</p>
          </div>
        </div>

        {/* Prev / Next buttons */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-[-14px] top-1/3 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 shadow border border-sea-light/30 text-sea-dark hover:bg-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-[-14px] top-1/3 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 shadow border border-sea-light/30 text-sea-dark hover:bg-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-sea-light w-5' : 'bg-sea-light/30'
              }`}
            />
          ))}
        </div>
      </Reveal>
    </Section>
  )
}
