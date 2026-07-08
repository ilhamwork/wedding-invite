import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

export default function Gallery() {
  const { t } = useTranslation()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = content.gallery
  const total = photos.length

  const isOpen = lightboxIndex !== null
  const prev = () => setLightboxIndex((i) => (i - 1 + total) % total)
  const next = () => setLightboxIndex((i) => (i + 1) % total)
  const close = () => setLightboxIndex(null)

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (total === 0) return null

  // Collage layout for 5 photos:
  //   [0] — full width, tall hero
  //   [1] [2] — two equal columns
  //   [3] [4] — two equal columns
  const collageRows = [
    [photos[0]].filter(Boolean),
    [photos[1], photos[2]].filter(Boolean),
    [photos[3], photos[4]].filter(Boolean),
  ]

  return (
    <Section id="gallery" bg="mist" fadeTop="#EDF6FD" fadeBottom="#EDF6FD">
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('gallery.title')}</h2>
      </Reveal>

      <Reveal variant="scaleUp" delay={0.1}>
        <div className="flex flex-col gap-2">
          {collageRows.map((row, rowIdx) => (
            <div
              key={rowIdx}
              className="flex gap-2"
            >
              {row.map((photo) => {
                const photoIdx = photos.indexOf(photo)
                const isHero = rowIdx === 0
                return (
                  <button
                    key={photo.src}
                    type="button"
                    onClick={() => setLightboxIndex(photoIdx)}
                    aria-label={`Open photo ${photoIdx + 1}`}
                    className="relative overflow-hidden rounded-2xl flex-1 block group"
                    style={{ aspectRatio: isHero ? '4/3' : '1/1' }}
                  >
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-sea/0 group-hover:bg-sea/20 transition-colors duration-300" />
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </Reveal>

      {/* Fullscreen Lightbox Carousel — rendered in document.body via portal */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 9999, backgroundColor: 'rgba(13,43,69,0.96)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photos[lightboxIndex].src}
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-full max-h-full object-contain px-14 py-12"
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>

            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute top-5 right-5 text-cream w-10 h-10 flex items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 transition-colors text-2xl leading-none"
            >
              &times;
            </button>

            {/* Prev */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev() }}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-cream w-11 h-11 flex items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 transition-colors text-3xl leading-none"
            >
              &#8249;
            </button>

            {/* Next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next() }}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-cream w-11 h-11 flex items-center justify-center rounded-full border border-cream/30 hover:bg-cream/10 transition-colors text-3xl leading-none"
            >
              &#8250;
            </button>

            {/* Counter */}
            <p className="absolute bottom-5 text-cream/50 text-xs tracking-widest">
              {lightboxIndex + 1} / {total}
            </p>

            {/* Dot indicators */}
            <div className="absolute bottom-10 flex gap-2 justify-center">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === lightboxIndex ? 'bg-cream w-5' : 'bg-cream/30 w-1.5'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body
      )}
    </Section>
  )
}
