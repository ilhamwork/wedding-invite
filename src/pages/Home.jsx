import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import useGuestName from '../hooks/useGuestName'
import Cover from '../components/Cover'
import Hero from '../components/Hero'
import QuoteVerse from '../components/QuoteVerse'
import Couple from '../components/Couple'
import OurStory from '../components/OurStory'
import Countdown from '../components/Countdown'
import EventDetails from '../components/EventDetails'
import Gallery from '../components/Gallery'
import RSVP from '../components/RSVP'
import Wishes from '../components/Wishes'
import GiftEnvelope from '../components/GiftEnvelope'
import Closing from '../components/Closing'
import MusicToggle from '../components/MusicToggle'
import LanguageToggle from '../components/LanguageToggle'

export default function Home() {
  const guestName = useGuestName()
  const [isOpen, setIsOpen] = useState(false)
  useTranslation() // ensures re-render on language change at this level

  return (
    <div className="paper-texture min-h-screen">
      {!isOpen && <Cover guestName={guestName} onOpen={() => setIsOpen(true)} />}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="main-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="fixed top-5 right-5 z-40"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <LanguageToggle />
            </motion.div>
            <main>
              {/* Sections alternate between section-alt-a and section-alt-b */}
              <div className="section-alt-a"><Hero /></div>
              <div className="section-alt-b"><QuoteVerse /></div>
              <div className="section-alt-a"><Couple /></div>
              <div className="section-alt-a"><OurStory /></div>
              <div className="section-alt-b"><Countdown /></div>
              <div className="section-alt-a"><EventDetails /></div>
              <div className="section-alt-b"><Gallery /></div>
              <div className="section-alt-a"><RSVP guestName={guestName} /></div>
              <div className="section-alt-b"><Wishes /></div>
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
