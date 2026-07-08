import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

export default function Gallery() {
  const { t } = useTranslation()
  const [current, setCurrent] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (content.gallery.length === 0) return null

  const photos = content.gallery
  const total = photos.length

  const prev = () => setCurrent((c) => (c - 1 + total) % total)
  const next = () => setCurrent((c) => (c + 1) % total)

  return (
    <Section id="gallery">
      <Reveal>
        <Eyebrow>{t('gallery.eyebrow')}</Eyebrow>
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('gallery.title')}</h2>
      </Reveal>

      <Reveal className="relative select-none">
        {/* Main photo */}
        <button
          type="button"
          onClick={() => setLightbox(true)}
          className="block w-full overflow-hidden rounded-2xl border hairline bg-sky/40 shadow-md"
          aria-label="Open fullscreen"
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={photos[current].src}
              src={photos[current].src}
              alt={photos[current].alt}
              loading="lazy"
              initial={{ opacity: 0, scale: 1.03 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-full aspect-4/3 object-cover"
            />
          </AnimatePresence>
        </button>

        {/* Prev / Next */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-[-14px] top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 shadow border border-sea-light/30 text-sea-dark hover:bg-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-[-14px] top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 shadow border border-sea-light/30 text-sea-dark hover:bg-white transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* Counter */}
        <p className="text-center text-xs text-ink-soft/50 tracking-widest mt-3">
          {current + 1} / {total}
        </p>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-2">
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === current ? 'bg-sea-light w-5' : 'bg-sea-light/30 w-2'
              }`}
            />
          ))}
        </div>
      </Reveal>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 bg-sea/95 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(false)}
          >
            <motion.img
              key={photos[current].src}
              src={photos[current].src}
              alt={photos[current].alt}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="max-w-full max-h-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="absolute top-5 right-5 text-cream text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full border border-cream/30"
              aria-label="Close"
            >
              &times;
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream w-10 h-10 flex items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 transition-colors"
              aria-label="Previous photo"
            >
              &#8249;
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream w-10 h-10 flex items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 transition-colors"
              aria-label="Next photo"
            >
              &#8250;
            </button>
            <p className="absolute bottom-4 text-cream/50 text-xs tracking-widest">
              {current + 1} / {total}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
