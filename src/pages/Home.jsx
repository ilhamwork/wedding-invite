import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import useGuestName from '../hooks/useGuestName'
import Cover from '../components/Cover'
import Hero from '../components/Hero'
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

      {isOpen && (
        <>
          <div className="fixed top-5 right-5 z-40">
            <LanguageToggle />
          </div>
          <main>
            <Hero />
            <Couple />
            <OurStory />
            <Countdown />
            <EventDetails />
            <Gallery />
            <RSVP guestName={guestName} />
            <Wishes />
            <GiftEnvelope />
            <Closing />
          </main>
          <MusicToggle />
        </>
      )}
    </div>
  )
}
