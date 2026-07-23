import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useGuestName from '../hooks/useGuestName'
import Cover from '../components/Cover'
import QuoteVerse from '../components/QuoteVerse'
import Couple from '../components/Couple'
import OurStory from '../components/OurStory'
import Countdown from '../components/Countdown'
import EventDetails from '../components/EventDetails'
import Gallery from '../components/Gallery'
import RSVPWishes from '../components/RSVPWishes'
import GiftEnvelope from '../components/GiftEnvelope'
import Closing from '../components/Closing'
import MusicToggle from '../components/MusicToggle'
import { content } from '../config/content.config'

const countdownImages = content.countdown?.images ?? content.gallery.map((g) => g.src)

export default function Home() {
  const { guestName, loading: guestLoading } = useGuestName()
  const [isOpen, setIsOpen] = useState(false)
  useTranslation() // ensures re-render on language change at this level

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <div className="paper-texture min-h-[100dvh]">
      {/* Preload countdown carousel images without affecting layout */}
      <div aria-hidden="true" style={{ display: 'none' }}>
        {countdownImages.map((src) => (
          <img key={src} src={src} alt="" />
        ))}
      </div>

      {/* Cover sits on top (z-50) and fades out on dismiss */}
      <AnimatePresence>
        {!isOpen && (
          <Cover
            key="cover"
            guestName={guestName}
            guestLoading={guestLoading}
            onOpen={() => setIsOpen(true)}
          />
        )}
      </AnimatePresence>

      {/* Main content — only mounted after cover is dismissed */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <main>
              <Countdown />
              <div className="section-alt-b"><QuoteVerse /></div>
              <div className="section-alt-a"><Couple /></div>
              <div className="section-alt-a"><EventDetails /></div>
              <div className="section-alt-a"><OurStory /></div>
              <div className="section-alt-b"><Gallery /></div>
              <div className="section-alt-b"><RSVPWishes guestName={guestName} /></div>
              <div className="section-alt-a"><GiftEnvelope /></div>
              <div className="section-alt-b"><Closing /></div>
            </main>
            <MusicToggle />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
