import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import { Reveal } from './ui/Section'

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 3 4'%3E%3Crect width='3' height='4' fill='%23EAE5D8'/%3E%3C/svg%3E"

/**
 * Decorative oval frame — drawn purely with CSS/SVG, no external assets needed.
 * Mimics the watercolor oval border from the reference image.
 */
function OvalFrame({ src, alt }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: 220, height: 270 }}>
      {/* Outer decorative ring */}
      <div
        className="absolute inset-0 rounded-[50%]"
        style={{
          border: '3px solid rgba(17,87,95,0.25)',
          boxShadow: '0 0 0 6px rgba(17,87,95,0.08), 0 0 0 10px rgba(17,87,95,0.04)',
        }}
      />
      {/* Second inner ring */}
      <div
        className="absolute rounded-[50%]"
        style={{
          inset: 10,
          border: '1.5px solid rgba(17,87,95,0.18)',
        }}
      />
      {/* Photo */}
      <div
        className="absolute overflow-hidden rounded-[50%]"
        style={{ inset: 6 }}
      >
        <img
          src={src ?? PLACEHOLDER}
          alt={alt}
          className="w-full h-full object-cover object-top"
        />
      </div>
    </div>
  )
}

export default function Couple() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'

  const { bride, groom } = content.couple

  return (
    <section id="couple" className="relative overflow-hidden" style={{ backgroundColor: '#F4F1EA' }}>
      <div className="relative px-6 pt-20 pb-16 max-w-lg mx-auto">

        {/* ── Section title ───────────────────────────────────── */}
        <Reveal variant="fadeIn">
          <p className="font-body text-xs tracking-[0.3em] uppercase text-center text-sea-light/70 mb-16">
            {t('couple.title')}
          </p>
        </Reveal>

        {/* ── BRIDE ROW: photo left, text right ───────────────── */}
        <Reveal variant="fadeIn" delay={0.1}>
          <div className="flex items-start justify-between gap-4 mb-4">

            {/* Oval photo — left side, slightly higher */}
            <div className="flex-shrink-0 -mt-4">
              <OvalFrame src={bride.photo} alt={bride.fullName} />
            </div>

            {/* Text — right side */}
            <div className="flex flex-col items-end text-right pt-8 flex-1">
              <h3
                className="font-display font-semibold leading-tight mb-4"
                style={{ fontSize: '1.65rem', color: '#0D3438', letterSpacing: '0.02em' }}
              >
                {bride.fullName}
              </h3>
              {bride.parents?.[lang] && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(17,87,95,0.7)' }}>
                  {bride.parents[lang]}
                </p>
              )}
            </div>

          </div>
        </Reveal>

        {/* ── Ampersand connector ─────────────────────────────── */}
        <Reveal variant="fadeIn" delay={0.18}>
          <div className="flex items-center justify-center my-2">
            <span className="font-script text-5xl leading-none select-none" style={{ color: 'rgba(17,87,95,0.4)' }}>
              &amp;
            </span>
          </div>
        </Reveal>

        {/* ── GROOM ROW: text left, photo right ───────────────── */}
        <Reveal variant="fadeIn" delay={0.26}>
          <div className="flex items-start justify-between gap-4 mt-4">

            {/* Text — left side */}
            <div className="flex flex-col items-start text-left pt-8 flex-1">
              <h3
                className="font-display font-semibold leading-tight mb-4"
                style={{ fontSize: '1.65rem', color: '#0D3438', letterSpacing: '0.02em' }}
              >
                {groom.fullName}
              </h3>
              {groom.parents?.[lang] && (
                <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: 'rgba(17,87,95,0.7)' }}>
                  {groom.parents[lang]}
                </p>
              )}
            </div>

            {/* Oval photo — right side */}
            <div className="flex-shrink-0 -mt-4">
              <OvalFrame src={groom.photo} alt={groom.fullName} />
            </div>

          </div>
        </Reveal>

      </div>
    </section>
  )
}
