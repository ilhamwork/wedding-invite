import { useEffect, useState } from 'react'

function getRemaining(targetISO) {
  const target = new Date(targetISO).getTime()
  const now = Date.now()
  const diff = Math.max(0, target - now)

  return {
    total: diff,
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function useCountdown(targetISO) {
  const [remaining, setRemaining] = useState(() => getRemaining(targetISO))

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(getRemaining(targetISO))
    }, 1000)
    return () => clearInterval(interval)
  }, [targetISO])

  return remaining
}
