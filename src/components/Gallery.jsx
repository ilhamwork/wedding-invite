import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

export default function Gallery() {
  const { t } = useTranslation()
  const [slideIndex, setSlideIndex] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [orientations, setOrientations] = useState({})

  const photos = content.gallery
  const total = photos.length

  // Mobile viewport detection (< 640px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Preload and detect image orientations (landscape vs portrait)
  useEffect(() => {
    photos.forEach((photo) => {
      const img = new Image()
      img.src = photo.src
      img.onload = () => {
        setOrientations((prev) => ({
          ...prev,
          [photo.src]: img.naturalWidth > img.naturalHeight ? 'landscape' : 'portrait',
        }))
      }
    })
  }, [photos])

  const handleImageLoad = (src, e) => {
    const { naturalWidth, naturalHeight } = e.target
    if (naturalWidth && naturalHeight) {
      const isLandscape = naturalWidth > naturalHeight
      setOrientations((prev) => {
        if (prev[src] === (isLandscape ? 'landscape' : 'portrait')) return prev
        return { ...prev, [src]: isLandscape ? 'landscape' : 'portrait' }
      })
    }
  }

  const isLandscapePhoto = (photo) => {
    if (!photo || !photo.src) return false
    if (photo.src.includes('-landscape')) return true
    return orientations[photo.src] === 'landscape'
  }

  // Slide grouping: 
  // Desktop: 1 photo per slide
  // Mobile: 2 landscape photos per slide (top & bottom), 1 portrait per slide
  const slides = useMemo(() => {
    if (!isMobile) {
      return photos.map((photo) => [photo])
    }

    const result = []
    const landscapeQueue = []

    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      if (isLandscapePhoto(photo)) {
        landscapeQueue.push(photo)
        if (landscapeQueue.length === 2) {
          result.push([...landscapeQueue])
          landscapeQueue.length = 0
        }
      } else {
        result.push([photo])
      }
    }

    while (landscapeQueue.length > 0) {
      if (landscapeQueue.length >= 2) {
        result.push([landscapeQueue.shift(), landscapeQueue.shift()])
      } else {
        result.push([landscapeQueue.shift()])
      }
    }

    return result
  }, [photos, isMobile, orientations])

  const totalSlides = slides.length
  const isOpen = slideIndex !== null

  const openPhotoInLightbox = (photo) => {
    const targetIndex = slides.findIndex((slide) =>
      slide.some((p) => p.src === photo.src)
    )
    setSlideIndex(targetIndex !== -1 ? targetIndex : 0)
  }

  const prev = () => setSlideIndex((i) => (i - 1 + totalSlides) % totalSlides)
  const next = () => setSlideIndex((i) => (i + 1) % totalSlides)
  const close = () => setSlideIndex(null)

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
  }, [isOpen, slideIndex, totalSlides])

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
  const gridPhotos = photos.slice(0, 4)
  const [hero, ...thumbs] = gridPhotos
  const currentSlide = isOpen ? slides[slideIndex] : null

  return (
    <Section id="gallery" bg="mist" fadeTop="#F7F4ED" fadeBottom="#F7F4ED">
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-sea mb-8">{t('gallery.title')}</h2>
      </Reveal>

      <Reveal variant="scaleUp" delay={0.1}>
        <div className="flex flex-col gap-2">
          {/* Hero row */}
          <button
            type="button"
            onClick={() => openPhotoInLightbox(hero)}
            aria-label="Open photo 1"
            className="relative overflow-hidden rounded-2xl block group w-full"
            style={{ aspectRatio: '4/3' }}
          >
            <img
              src={hero.src}
              alt={hero.alt}
              loading="lazy"
              onLoad={(e) => handleImageLoad(hero.src, e)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-sea/0 group-hover:bg-sea/20 transition-colors duration-300" />
          </button>

          {/* Thumbnail row — 3 images */}
          <div className="flex gap-2">
            {thumbs.map((photo) => {
              const photoIdx = photos.indexOf(photo)
              const isLast = photoIdx === gridPhotos.length - 1 && total > 4
              return (
                <button
                  key={photo.src}
                  type="button"
                  onClick={() => openPhotoInLightbox(photo)}
                  aria-label={`Open photo ${photoIdx + 1}`}
                  className="relative overflow-hidden rounded-2xl flex-1 block group"
                  style={{ aspectRatio: '1/1' }}
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    loading="lazy"
                    onLoad={(e) => handleImageLoad(photo.src, e)}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* "+N more" overlay on last visible thumb if there are hidden photos */}
                  {isLast && total > 4 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-sea-dark/55 backdrop-blur-sm">
                      <span className="font-display text-white text-xl">+{total - 4}</span>
                    </div>
                  )}
                  {!isLast && (
                    <div className="absolute inset-0 bg-sea/0 group-hover:bg-sea/20 transition-colors duration-300" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </Reveal>

      {/* Fullscreen Lightbox */}
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
              {currentSlide && currentSlide.length > 1 ? (
                <motion.div
                  key={`slide-${slideIndex}-${currentSlide[0].src}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center gap-3 px-12 py-14 max-h-[82vh] max-w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img
                    src={currentSlide[0].src}
                    alt={currentSlide[0].alt}
                    onLoad={(e) => handleImageLoad(currentSlide[0].src, e)}
                    className="max-h-[38vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-cream/10"
                    draggable={false}
                  />
                  <img
                    src={currentSlide[1].src}
                    alt={currentSlide[1].alt}
                    onLoad={(e) => handleImageLoad(currentSlide[1].src, e)}
                    className="max-h-[38vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-cream/10"
                    draggable={false}
                  />
                </motion.div>
              ) : currentSlide && currentSlide.length === 1 ? (
                <motion.img
                  key={`slide-${slideIndex}-${currentSlide[0].src}`}
                  src={currentSlide[0].src}
                  alt={currentSlide[0].alt}
                  onLoad={(e) => handleImageLoad(currentSlide[0].src, e)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="max-w-full max-h-full object-contain px-14 py-12"
                  onClick={(e) => e.stopPropagation()}
                  draggable={false}
                />
              ) : null}
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
              {slideIndex + 1} / {totalSlides}
            </p>

            {/* Dot indicators */}
            <div className="absolute bottom-6 flex gap-2 justify-center flex-wrap px-8">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setSlideIndex(i) }}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === slideIndex ? 'bg-cream w-5' : 'bg-cream/30 w-1.5'
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
