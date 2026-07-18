import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

/**
 * Resolves the guest name from the `?to=<slug>` query param,
 * validated against the `guests` table in Supabase.
 *
 * - `?to=john`  → SELECT name FROM guests WHERE slug = 'john'
 * - Found       → show name (e.g. "John")
 * - Not found   → guestName stays '', cover shows fallback
 * - No `?to=`   → guestName stays '', cover shows fallback
 *
 * Returns { guestName: string, loading: boolean }
 */
export default function useGuestName() {
  const [guestName, setGuestName] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (!to) return

    const slug = decodeURIComponent(to).trim()
    if (!slug) return

    if (!isSupabaseConfigured) {
      console.warn('[useGuestName] Supabase not configured.')
      return
    }

    let cancelled = false
    setLoading(true)

    supabase
      .from('guests')
      .select('name')
      .ilike('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data?.name) {
          setGuestName(data.name)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { guestName, loading }
}
