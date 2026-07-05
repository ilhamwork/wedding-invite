import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { content } from '../config/content.config'

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    const audio = new Audio(content.music.src)
    audio.loop = true
    audio.muted = true // must start muted per browser autoplay policy
    audio.preload = 'none'
    audioRef.current = audio
    return () => {
      audio.pause()
      audioRef.current = null
    }
  }, [])

  // Called on the first real user interaction (the "Buka Undangan" tap).
  function unlockAndPlay() {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = false
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
  }

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      audio.muted = false
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <AudioCtx.Provider value={{ isPlaying, unlockAndPlay, toggle }}>
      {children}
    </AudioCtx.Provider>
  )
}

export function useAudio() {
  const ctx = useContext(AudioCtx)
  if (!ctx) throw new Error('useAudio must be used within AudioProvider')
  return ctx
}
