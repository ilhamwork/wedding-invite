import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%23CBE8F8'/%3E%3C/svg%3E"

// Instagram icon (simple SVG)
function InstagramIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

function PersonCard({ person, align = 'left', lang }) {
  const isRight = align === 'right'
  const parents = person.parents?.[lang]

  return (
    <div className={`flex flex-col ${isRight ? 'items-end text-right' : 'items-start text-left'}`}>
      {/* Oval photo */}
      <div className="relative w-full mb-6">
        {/* Oval photo */}
        <div className={`relative mx-auto w-56 h-72 rounded-[50%] overflow-hidden border-2 border-white/60 shadow-lg bg-sky/40 ${isRight ? 'mr-0 ml-auto' : 'ml-0 mr-auto'}`}>
          <img
            src={person.photo ?? PLACEHOLDER}
            alt={person.fullName}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Name */}
      <h3 className="font-display text-2xl text-sea leading-tight mb-2">
        {person.fullName}
      </h3>

      {/* Parents */}
      {parents && (
        <p className="text-sm text-sea-mid/80 leading-relaxed whitespace-pre-line mb-3">
          {parents}
        </p>
      )}

      {/* Instagram */}
      {person.instagram && (
        <a
          href={`https://instagram.com/${person.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram ${person.fullName}`}
          className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-sea/10 text-sea hover:bg-sea/20 transition border border-sea/20"
        >
          <InstagramIcon />
        </a>
      )}
    </div>
  )
}

export default function Couple() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  return (
    <Section id="couple" bg="texture" flip={false} fadeTop="#EDF6FD" fadeBottom="#CBE8F8">
      <Reveal>
        <h2 className="font-display text-2xl text-center text-ink mb-8">
          {t('couple.title')}
        </h2>
      </Reveal>

      {/* Groom */}
      <Reveal delay={0.05} className="mt-6">
        <PersonCard person={content.couple.groom} align="left" lang={lang} />
      </Reveal>

      {/* Ampersand divider */}
      <Reveal delay={0.1} className="text-center my-2">
        <span className="font-script text-5xl text-sea-light leading-none select-none">&amp;</span>
      </Reveal>

      {/* Bride */}
      <Reveal delay={0.15}>
        <PersonCard person={content.couple.bride} align="right" lang={lang} />
      </Reveal>
    </Section>
  )
}
