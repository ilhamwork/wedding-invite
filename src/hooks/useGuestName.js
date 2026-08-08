import { useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

/**
 * Resolves the guest name from the `?to=<slug>` query param,
 * validated against the `guests` table in Supabase.
 *
 * - `?to=john`  → SELECT name FROM guests WHERE slug = 'john'
 * - Found       → guestName = "John", notInvited = false
 * - Not found   → guestName = '', notInvited = true  (block access)
 * - No `?to=`   → guestName = '', notInvited = false (open access)
 *
 * Returns { guestName, guestSlug, notInvited, loading }
 */
export default function useGuestName() {
  const [guestName, setGuestName] = useState('')
  const [guestSlug, setGuestSlug] = useState('')
  const [notInvited, setNotInvited] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const params = new URLSearchParams(window.location.search)
    const to = params.get('to')
    if (!to) return

    const slug = decodeURIComponent(to).trim()
    if (!slug) return

    setGuestSlug(slug)

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
        } else {
          // slug provided but not found in DB → not invited
          setNotInvited(true)
        }
        setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { guestName, guestSlug, notInvited, loading }
}
