import { useEffect, useState, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Section, { Reveal, Eyebrow } from './ui/Section'

const PAGE_SIZE = 5

export default function Wishes() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en-US' : 'id-ID'

  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchPage = useCallback(async (pageIndex) => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      setLoadError(true)
      return
    }
    const from = pageIndex * PAGE_SIZE
    const to = from + PAGE_SIZE - 1
    const { data, error } = await supabase
      .from('wishes')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      setLoadError(true)
      setLoading(false)
      return
    }
    setWishes((prev) => (pageIndex === 0 ? data : [...prev, ...data]))
    setHasMore((data?.length ?? 0) === PAGE_SIZE)
    setLoading(false)
  }, [])

  useEffect(() => {
    fetchPage(0)
  }, [fetchPage])

  // Optional realtime: prepend new wishes as they arrive.
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const channel = supabase
      .channel('wishes-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'wishes' },
        (payload) => {
          setWishes((prev) => {
            if (prev.some((w) => w.id === payload.new.id)) return prev
            return [payload.new, ...prev]
          })
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  function validate() {
    const next = {}
    if (!name.trim()) next.name = t('wishes.errors.nameRequired')
    if (!message.trim()) next.message = t('wishes.errors.messageRequired')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (submitting || !validate()) return
    setSubmitting(true)
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase not configured')
      const { error } = await supabase.from('wishes').insert({
        name: name.trim(),
        message: message.trim(),
      })
      if (error) throw error
      setName('')
      setMessage('')
    } catch (err) {
      console.error(err)
      toast.error(t('wishes.errorBody'))
    } finally {
      setSubmitting(false)
    }
  }

  function loadMore() {
    const next = page + 1
    setPage(next)
    fetchPage(next)
  }

  return (
    <Section id="wishes" bg="sky" fadeTop="#CBE8F8" fadeBottom="#CBE8F8">
      <Reveal>
        <h2 className="font-display text-2xl text-center text-ink mb-8">{t('wishes.title')}</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-4 mb-10">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('wishes.namePlaceholder')}
              className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sea-light/40"
            />
            {errors.name && <p className="text-xs text-sea-light mt-1">{errors.name}</p>}
          </div>
          <div>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('wishes.messagePlaceholder')}
              className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sea-light/40 resize-none"
            />
            {errors.message && <p className="text-xs text-sea-light mt-1">{errors.message}</p>}
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-full bg-sea text-cream text-xs tracking-[0.25em] uppercase hover:bg-sea-mid transition-colors disabled:opacity-60"
          >
            {submitting ? t('wishes.submitting') : t('wishes.submit')}
          </button>
        </form>

        <div className="space-y-4">
          {loading && <p className="text-center text-sm text-ink-soft/60">{t('common.loading')}</p>}
          {!loading && loadError && (
            <p className="text-center text-sm text-sea-light">{t('common.error')}</p>
          )}
          {!loading && !loadError && wishes.length === 0 && (
            <p className="text-center text-sm text-ink-soft/60">{t('wishes.empty')}</p>
          )}
          {wishes.map((w) => (
            <div key={w.id} className="rounded-2xl border hairline bg-pebble/40 p-4">
              <div className="flex items-baseline justify-between mb-1">
                <p className="font-display text-base text-ink">{w.name}</p>
                <p className="text-[10px] text-ink-soft/50">
                  {new Date(w.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <p className="text-sm text-ink-soft/85 leading-relaxed">{w.message}</p>
            </div>
          ))}
        </div>

        {!loading && !loadError && hasMore && wishes.length > 0 && (
          <button
            type="button"
            onClick={loadMore}
            className="w-full mt-6 py-2.5 rounded-full border hairline text-xs tracking-[0.2em] uppercase text-ink-soft hover:bg-sky/50 transition-colors"
          >
            {t('wishes.loadMore')}
          </button>
        )}
      </Reveal>
    </Section>
  )
}
