import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

// ─── Masonry item with scroll-triggered reveal ───────────────────────────────
function MasonryPhoto({ photo, index, onClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })
  const isPortrait = photo.src.includes('portrait')

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => onClick(index)}
      aria-label={`Open photo ${index + 1}`}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: (index % 2) * 0.12 }}
      className="relative overflow-hidden rounded-2xl block w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-sea"
      style={{ aspectRatio: isPortrait ? '3/4' : '4/3' }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
      />
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-linear-to-t from-sea-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      {/* Corner accent */}
      <div className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-cream/60 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 translate-y-2 group-hover:translate-x-0 group-hover:translate-y-0" />
    </motion.button>
  )
}

// ─── "+N more" reveal tile ────────────────────────────────────────────────────
function MoreTile({ count, lastPhoto, onClick }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px 0px' })

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={`View ${count} more photos`}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.12 }}
      className="relative overflow-hidden rounded-2xl block w-full group focus:outline-none focus-visible:ring-2 focus-visible:ring-sea"
      style={{ aspectRatio: '3/4' }}
    >
      <img
        src={lastPhoto.src}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="w-full h-full object-cover scale-105 blur-[2px] brightness-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
        <span className="font-display text-white text-4xl leading-none">+{count}</span>
        <span className="text-cream/70 text-xs tracking-[0.2em] uppercase">photos</span>
      </div>
    </motion.button>
  )
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useTranslation()
  const [slotIndex, setSlotIndex] = useState(null)

  const photos = content.gallery
  const total = photos.length

  // ── Build slot list ──────────────────────────────────────────────────────────
  // A "slot" is either:
  //   { type: 'single', idx }              — portrait or lone landscape
  //   { type: 'pair',   idx, idx2 }        — two consecutive landscape photos
  //
  // Rule: if photos[i] and photos[i+1] are both landscape → merge into one pair slot,
  //       then skip i+1 (it's consumed).
  const isLandscape = (i) => photos[i]?.src.includes('landscape')

  const slots = []
  let i = 0
  while (i < total) {
    if (isLandscape(i) && isLandscape(i + 1)) {
      slots.push({ type: 'pair', idx: i, idx2: i + 1 })
      i += 2
    } else {
      slots.push({ type: 'single', idx: i })
      i += 1
    }
  }

  // Map raw photo index → slot index (used when tapping a grid tile)
  const photoToSlot = {}
  slots.forEach((slot, si) => {
    photoToSlot[slot.idx] = si
    if (slot.idx2 != null) photoToSlot[slot.idx2] = si
  })

  const totalSlots = slots.length
  const isOpen = slotIndex !== null
  const openAt = (photoIdx) => setSlotIndex(photoToSlot[photoIdx] ?? 0)
  const prev = () => setSlotIndex((s) => (s - 1 + totalSlots) % totalSlots)
  const next = () => setSlotIndex((s) => (s + 1) % totalSlots)
  const close = () => setSlotIndex(null)

  // Split into 2 masonry columns — alternate left/right
  // Show first 5 photos in grid; rest only accessible via lightbox
  const VISIBLE = 5
  const visiblePhotos = photos.slice(0, VISIBLE)
  const leftCol = visiblePhotos.filter((_, i) => i % 2 === 0)   // 0, 2, 4
  const rightCol = visiblePhotos.filter((_, i) => i % 2 === 1)  // 1, 3

  // Keyboard
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, slotIndex])

  // Body scroll lock
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Swipe
  const [touchStart, setTouchStart] = useState(null)
  const onTouchStart = (e) => setTouchStart(e.touches[0].clientX)
  const onTouchEnd = (e) => {
    if (touchStart === null) return
    const dx = e.changedTouches[0].clientX - touchStart
    if (Math.abs(dx) > 40) dx < 0 ? next() : prev()
    setTouchStart(null)
  }

  if (total === 0) return null

  const currentSlot = isOpen ? slots[slotIndex] : null

  return (
    <Section id="gallery" bg="mist" fadeTop="#F7F4ED" fadeBottom="#F7F4ED">
      {/* Section title */}
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-sea mb-2">
          {t('gallery.title')}
        </h2>
        <p className="text-center text-sea/40 text-xs tracking-[0.25em] uppercase mb-8">
          {total} photos
        </p>
      </Reveal>

      {/* ── Masonry grid ── */}
      <div className="flex gap-2.5 items-start">
        {/* Left column — starts at top */}
        <div className="flex flex-col gap-2.5 flex-1">
          {leftCol.map((photo) => {
            const idx = photos.indexOf(photo)
            return (
              <MasonryPhoto
                key={photo.src}
                photo={photo}
                index={idx}
                onClick={openAt}
              />
            )
          })}
        </div>

        {/* Right column — offset down to create masonry rhythm */}
        <div className="flex flex-col gap-2.5 flex-1 mt-10">
          {rightCol.map((photo) => {
            const idx = photos.indexOf(photo)
            const isLast = idx === VISIBLE - 2 && total > VISIBLE
            return isLast ? (
              <MoreTile
                key={photo.src}
                count={total - VISIBLE + 1}
                lastPhoto={photo}
                onClick={() => openAt(idx)}
              />
            ) : (
              <MasonryPhoto
                key={photo.src}
                photo={photo}
                index={idx}
                onClick={openAt}
              />
            )
          })}
        </div>
      </div>

      {/* ── Lightbox ── */}
      {isOpen && createPortal(
        <AnimatePresence>
          <motion.div
            key="lightbox-backdrop"
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 9999, backgroundColor: 'rgba(15,12,10,0.96)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Photo(s) */}
            <AnimatePresence mode="wait">
              {currentSlot && (
                <motion.div
                  key={`lb-${slotIndex}`}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.03 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className={`flex px-10 py-4 ${currentSlot.type === 'pair' ? 'flex-col gap-1.5 items-center' : 'items-center justify-center'}`}
                  style={{ maxWidth: '100%', maxHeight: '100vh' }}
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                >
                  <img
                    src={photos[currentSlot.idx].src}
                    alt={photos[currentSlot.idx].alt}
                    className={`object-contain ${currentSlot.type === 'pair' ? 'max-w-full max-h-[46vh]' : 'max-w-full max-h-[92vh]'}`}
                    draggable={false}
                  />
                  {currentSlot.type === 'pair' && (
                    <img
                      src={photos[currentSlot.idx2].src}
                      alt={photos[currentSlot.idx2].alt}
                      className="object-contain max-w-full max-h-[46vh]"
                      draggable={false}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close */}
            <button
              type="button"
              onClick={close}
              aria-label="Close lightbox"
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
            <p className="absolute bottom-14 text-cream/40 text-xs tracking-[0.2em]">
              {slotIndex + 1} / {totalSlots}
            </p>

            {/* Dot strip */}
            <div className="absolute bottom-6 flex gap-1.5 justify-center flex-wrap px-8">
              {slots.map((slot, si) => (
                <button
                  key={si}
                  onClick={(e) => { e.stopPropagation(); setSlotIndex(si) }}
                  aria-label={`Go to photo ${si + 1}`}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    si === slotIndex ? 'bg-cream w-6' : 'bg-cream/25 w-1'
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
