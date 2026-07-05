import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal, Eyebrow } from './ui/Section'

export default function Gallery() {
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(null)

  return (
    <Section id="gallery">
      <Reveal>
        <Eyebrow>{t('gallery.eyebrow')}</Eyebrow>
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('gallery.title')}</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {content.gallery.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`overflow-hidden rounded-xl border hairline bg-sand/40 ${
                i % 5 === 0 ? 'col-span-2 row-span-2 aspect-square' : 'aspect-square'
              }`}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </button>
          ))}
        </div>
      </Reveal>

      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveIndex(null)}
          >
            <motion.img
              key={content.gallery[activeIndex].src}
              src={content.gallery[activeIndex].src}
              alt={content.gallery[activeIndex].alt}
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="max-w-full max-h-full rounded-lg object-contain"
            />
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute top-5 right-5 text-cream text-2xl leading-none w-10 h-10 flex items-center justify-center rounded-full border border-cream/30"
              aria-label="Close"
            >
              &times;
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  )
}
