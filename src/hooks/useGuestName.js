import { useMemo } from 'react'

export default function useGuestName() {
  return useMemo(() => {
    if (typeof window === 'undefined') return ''
    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (!to) return ''
    return to.replace(/\+/g, ' ').trim()
  }, [])
}
