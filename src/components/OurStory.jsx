import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { content } from '../config/content.config'
import Section, { Reveal } from './ui/Section'

const ease = [0.22, 1, 0.36, 1]

const PLACEHOLDER =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 4"%3E%3Crect width="3" height="4" fill="%23c8d8dd"/%3E%3C/svg%3E'

const SLIDE_VARIANTS = {
  enter: (dir) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0.4 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0.4 }),
}

export default function OurStory() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en' : 'id'
  const items = content.story

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)

  // touch / drag state
  const dragStart = useRef(null)

  function goTo(idx) {
    setDirection(idx > current ? 1 : -1)
    setCurrent(idx)
  }
  function prev() { if (current > 0) goTo(current - 1) }
  function next() { if (current < items.length - 1) goTo(current + 1) }

  function onPointerDown(e) { dragStart.current = e.clientX }
  function onPointerUp(e) {
    if (dragStart.current === null) return
    const delta = e.clientX - dragStart.current
    dragStart.current = null
    if (delta < -40) next()
    else if (delta > 40) prev()
  }

  const item = items[current]

  return (
    <Section id="story" bg="sky" fadeTop="#EEE9DE" fadeBottom="#EEE9DE">

      {/* ── Section heading ── */}
      <Reveal variant="scaleUp">
        <h2 className="font-display text-2xl text-center text-sea mb-8">{t('story.eyebrow')}</h2>
      </Reveal>

      {/* ── Progress bar ── */}
      <div className="flex gap-1.5 px-6 mb-4">
        {items.map((_, i) => (
          <div
            key={i}
            className="h-[2px] flex-1 rounded-full overflow-hidden"
            style={{ background: 'rgba(46,58,79,0.12)' }}
          >
            <motion.div
              animate={{ scaleX: i === current ? 1 : i < current ? 1 : 0 }}
              initial={{ scaleX: 0 }}
              transition={{ duration: 0.4, ease }}
              style={{ originX: 0, background: 'rgba(201,169,110,0.8)', height: '100%', borderRadius: 9999, transformOrigin: 'left' }}
            />
          </div>
        ))}
      </div>

      {/* ── Slide area ── */}
      <div
        className="relative mx-auto overflow-hidden"
        style={{ maxWidth: 420, cursor: 'grab' }}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerLeave={(e) => { if (dragStart.current !== null) onPointerUp(e) }}
      >
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={current}
            custom={direction}
            variants={SLIDE_VARIANTS}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease }}
            className="w-full select-none"
          >
            {/* Photo */}
            <div
              className="relative mx-6 overflow-hidden"
              style={{ borderRadius: 20, aspectRatio: '3/4' }}
            >
              <img
                src={item.photo ?? PLACEHOLDER}
                alt={item.title[lang]}
                className="w-full h-full object-cover"
                draggable={false}
              />

              {/* Bottom gradient overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(to top, rgba(20,16,12,0.88) 0%, rgba(20,16,12,0.35) 45%, transparent 72%)',
                }}
              />

              {/* Year — large watermark style */}
              <span
                className="absolute top-4 right-5 font-display font-bold select-none"
                style={{
                  fontSize: '4rem',
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.09)',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.year}
              </span>

              {/* Text overlay */}
              <div className="absolute bottom-0 left-0 right-0 px-5 pb-6 pt-10">
                {/* Year pill */}
                <span
                  className="inline-block font-body text-[10px] tracking-[0.2em] uppercase px-3 py-1 rounded-full mb-3"
                  style={{
                    background: 'rgba(201,169,110,0.2)',
                    border: '1px solid rgba(201,169,110,0.4)',
                    color: 'rgba(201,169,110,0.9)',
                  }}
                >
                  {item.year}
                </span>

                <h3
                  className="font-display text-xl mb-2 leading-snug"
                  style={{ color: 'rgba(255,255,255,0.92)' }}
                >
                  {item.title[lang]}
                </h3>
                <p
                  className="font-body text-[12px] leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.6)' }}
                >
                  {item.caption[lang]}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Tap zones — invisible left/right tap areas */}
        <button
          onClick={prev}
          aria-label="Previous"
          className="absolute left-0 top-0 bottom-0 w-1/3 z-10"
          style={{ background: 'transparent' }}
          tabIndex={-1}
        />
        <button
          onClick={next}
          aria-label="Next"
          className="absolute right-0 top-0 bottom-0 w-1/3 z-10"
          style={{ background: 'transparent' }}
          tabIndex={-1}
        />
      </div>

      {/* ── Dot + counter ── */}
      <div className="flex flex-col items-center gap-3 pt-5 pb-16">
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className="transition-all duration-300"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                borderRadius: 9999,
                background:
                  i === current
                    ? 'rgba(201,169,110,0.85)'
                    : 'rgba(46,58,79,0.2)',
              }}
            />
          ))}
        </div>
        <p
          className="font-body text-[10px] tracking-widest"
          style={{ color: 'rgba(46,58,79,0.35)' }}
        >
          {current + 1} / {items.length}
        </p>
      </div>

    </Section>
  )
}
