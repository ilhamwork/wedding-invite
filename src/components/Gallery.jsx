import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import { Reveal } from './ui/Section'

// ─── Vertical offset pattern for staggered look ──────────────────────────────
// Each photo gets a top offset so they don't align — creates natural masonry feel
const OFFSETS = [0, 60, 20, 80, 10, 50, 30, 70, 15, 55, 35, 65, 5, 45, 25, 75, 40, 0, 60, 20, 80]

// ─── Single scrollable photo tile ────────────────────────────────────────────
function ScrollPhoto({ photo, index, onClick, unlocked }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '0px -80px' })
  const isPortrait = photo.src.includes('portrait')
  const offset = OFFSETS[index % OFFSETS.length]

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={() => unlocked && onClick(index)}
      aria-label={`Open photo ${index + 1}`}
      initial={{ opacity: 0, x: 24 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className="relative overflow-hidden shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-sea"
      style={{
        width: isPortrait ? 270 : 400,
        height: isPortrait ? 360 : 300,
        marginTop: offset,
        cursor: unlocked ? 'pointer' : 'default',
      }}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="lazy"
        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-[1.06]"
        style={{
          filter: unlocked ? 'grayscale(0%)' : 'grayscale(100%)',
          transition: 'filter 0.8s ease, transform 0.7s ease',
        }}
      />
      {unlocked && (
        <div className="absolute inset-0 bg-linear-to-t from-sea-dark/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      )}
    </motion.button>
  )
}

// ─── Main Gallery ─────────────────────────────────────────────────────────────
export default function Gallery() {
  const { t } = useTranslation()
  const [slotIndex, setSlotIndex] = useState(null)
  const [unlocked, setUnlocked] = useState(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const scrollRef = useRef(null)

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
    <section id="gallery" className="relative w-full overflow-hidden bg-[#F7F4ED] py-16">
      {/* Section title */}
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-sea mb-10 px-6">
          {t('gallery.title')}
        </h2>
      </Reveal>

      {/* ── Wrapper: clips the scroll strip + positions the lock overlay ── */}
      <div className="relative">
        {/* Horizontal scroll strip */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto pl-6 pr-6"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch',
            alignItems: 'flex-start',
            // lock scroll when not unlocked
            overflowX: unlocked ? 'auto' : 'hidden',
            pointerEvents: unlocked ? 'auto' : 'none',
          }}
        >
          {photos.map((photo, idx) => (
            <ScrollPhoto
              key={photo.src}
              photo={photo}
              index={idx}
              onClick={openAt}
              unlocked={unlocked}
            />
          ))}
        </div>

        {/* Lock overlay — shown until unlocked */}
        <AnimatePresence>
          {!unlocked && (
            <motion.div
              key="gallery-lock"
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.6, ease: 'easeOut' } }}
              style={{ pointerEvents: 'auto' }}
            >
              <motion.button
                type="button"
                onClick={() => {
                  setUnlocked(true)
                  setShowSwipeHint(true)
                  setTimeout(() => setShowSwipeHint(false), 5000)
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="relative z-10 px-7 py-3 bg-sea text-cream text-xs tracking-[0.25em] uppercase font-medium rounded-full shadow-lg"
              >
                {t('gallery.open') ?? 'Open'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lock button — shown when unlocked */}
        <AnimatePresence>
          {unlocked && (
            <motion.button
              key="gallery-relock"
              type="button"
              onClick={() => setUnlocked(false)}
              aria-label="Lock gallery"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-sea/80 text-cream text-lg leading-none shadow-md backdrop-blur-sm"
            >
              &times;
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Swipe hint guide ── */}
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              key="swipe-hint"
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ zIndex: 20 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.5 } }}
            >
              <div className="flex flex-col items-center gap-2">
                {/* Hand + arrows animation */}
                <div className="relative flex items-center h-10">
                  {/* Hand icon */}
                  <motion.span
                    animate={{ x: [20, -20, 20, -20, 20] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ fontSize: 26, display: 'inline-block', userSelect: 'none' }}
                  >
                    👆
                  </motion.span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
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
    </section>
  )
}
