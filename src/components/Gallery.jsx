import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

export default function Gallery() {
  const { t } = useTranslation()
  const [lightboxIndex, setLightboxIndex] = useState(null)

  const photos = content.gallery
  const total = photos.length

  // Only 4 photos shown in the grid
  const gridPhotos = photos.slice(0, 4)

  const isOpen = lightboxIndex !== null
  const prev = () => setLightboxIndex((i) => (i - 1 + total) % total)
  const next = () => setLightboxIndex((i) => (i + 1) % total)
  const close = () => setLightboxIndex(null)

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, lightboxIndex])

  // Lock body scroll when lightbox is open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Touch/swipe support
  const [touchStartX, setTouchStartX] = useState(null)
  function onTouchStart(e) { setTouchStartX(e.touches[0].clientX) }
  function onTouchEnd(e) {
    if (touchStartX === null) return
    const dx = e.changedTouches[0].clientX - touchStartX
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    setTouchStartX(null)
  }

  if (total === 0) return null

  // 4-photo grid: 1 hero (top), 3 thumbnails (bottom row)
  const [hero, ...thumbs] = gridPhotos

  return (
    <Section id="gallery" bg="mist" fadeTop="#F7F4ED" fadeBottom="#F7F4ED">
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-sea mb-8">{t('gallery.title')}</h2>
      </Reveal>

      <Reveal variant="scaleUp" delay={0.1}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {photos.map((photo, photoIdx) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setLightboxIndex(photoIdx)}
              aria-label={`Open photo ${photoIdx + 1}`}
              className="relative overflow-hidden rounded-2xl block group w-full shadow-sm"
              style={{ aspectRatio: photoIdx === 0 ? '4/3' : '1/1' }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-sea/0 group-hover:bg-sea/20 transition-colors duration-300 flex items-center justify-center">
                <span className="text-white opacity-0 group-hover:opacity-100 text-2xl transition-opacity">🔍</span>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      {/* Fullscreen Lightbox — slide one by one */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 9999, backgroundColor: 'rgba(28,25,23,0.97)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={photos[lightboxIndex].src}
                src={photos[lightboxIndex].src}
                alt={photos[lightboxIndex].alt}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-full max-h-full object-contain px-14 py-12"
                onClick={(e) => e.stopPropagation()}
                draggable={false}
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
            <p className="absolute bottom-14 text-cream/50 text-xs tracking-widest">
              {lightboxIndex + 1} / {total}
            </p>

            {/* Dot indicators */}
            <div className="absolute bottom-6 flex gap-2 justify-center flex-wrap px-8">
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
