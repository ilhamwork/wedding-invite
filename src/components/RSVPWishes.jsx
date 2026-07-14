import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { Reveal } from './ui/Section'

const PAGE_SIZE = 50

const ATTENDANCE_OPTIONS = [
  { value: 'attending',     labelKey: 'rsvp.attending' },
  { value: 'not_attending', labelKey: 'rsvp.notAttending' },
  { value: 'maybe',         labelKey: 'rsvp.maybe' },
]

export default function RSVPWishes({ guestName }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en-US' : 'id-ID'

  // Form state
  const [name, setName]             = useState(guestName || '')
  const [attendance, setAttendance] = useState('')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage]       = useState('')
  const [errors, setErrors]         = useState({})
  const [status, setStatus]         = useState('idle') // idle | submitting | success

  // Wishes list state
  const [wishes, setWishes]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [loadError, setLoadError]   = useState(false)
  const [justSubmittedId, setJustSubmittedId] = useState(null)

  // Fetch wishes
  const fetchWishes = useCallback(async () => {
    if (!isSupabaseConfigured) { setLoading(false); setLoadError(true); return }
    const { data, error } = await supabase
      .from('wishes')
      .select('id, name, message, created_at')
      .order('created_at', { ascending: false })
      .range(0, PAGE_SIZE - 1)
    if (error) { setLoadError(true); setLoading(false); return }
    setWishes(data)
    setLoading(false)
  }, [])

  useEffect(() => { fetchWishes() }, [fetchWishes])

  // Realtime
  useEffect(() => {
    if (!isSupabaseConfigured) return
    const channel = supabase
      .channel('wishes-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'wishes' }, (payload) => {
        setWishes((prev) => prev.some((w) => w.id === payload.new.id) ? prev : [payload.new, ...prev])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  function validate() {
    const next = {}
    if (!name.trim())                                      next.name       = t('rsvp.errors.nameRequired')
    if (!attendance)                                       next.attendance = t('rsvp.errors.attendanceRequired')
    if (!guestCount || guestCount < 1 || guestCount > 10) next.guestCount = t('rsvp.errors.guestCountInvalid')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting' || !validate()) return
    setStatus('submitting')
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase not configured')

      // Insert RSVP
      const { error: rsvpError } = await supabase.from('rsvps').insert({
        guest_name:        name.trim(),
        attendance_status: attendance,
        guest_count:       guestCount,
        message:           message.trim() || null,
      })
      if (rsvpError) throw rsvpError

      // Insert wish if message provided
      if (message.trim()) {
        const { data: wishData, error: wishError } = await supabase
          .from('wishes')
          .insert({ name: name.trim(), message: message.trim() })
          .select('id, name, message, created_at')
          .single()
        if (!wishError && wishData) {
          setWishes((prev) => prev.some((w) => w.id === wishData.id) ? prev : [wishData, ...prev])
          setJustSubmittedId(wishData.id)
          setTimeout(() => setJustSubmittedId(null), 3000)
        }
      }

      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('idle')
      toast.error(t('rsvp.errorBody'))
    }
  }

  return (
    <section id="rsvp-wishes" className="relative" style={{ backgroundColor: '#F7F4ED' }}>
      <div className="relative px-6 py-20 sm:py-24 max-w-xl mx-auto">

        <Reveal variant="fadeIn">
          <h2 className="font-display text-2xl text-center text-ink mb-10">
            {t('rsvp.title')}
          </h2>
        </Reveal>

        {/* ── Success state ── */}
        {status === 'success' ? (
          <Reveal variant="fadeIn">
            <div className="text-center py-8">
              <p className="font-display text-xl text-ink mb-2">{t('rsvp.successTitle')}</p>
              <p className="text-sm text-ink-soft/70">{t('rsvp.successBody')}</p>
            </div>
          </Reveal>
        ) : (
          <Reveal variant="fadeUp" delay={0.1}>
            <form onSubmit={handleSubmit} noValidate className="space-y-5">

              {/* Name */}
              <div>
                <label htmlFor="rf-name" className="block text-xs uppercase tracking-widest text-ink-soft/70 mb-1.5">
                  {t('rsvp.name')}
                </label>
                <input
                  id="rf-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('rsvp.namePlaceholder')}
                  className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                {errors.name && <p className="text-xs text-ink-soft/70 mt-1">{errors.name}</p>}
              </div>

              {/* Attendance */}
              <div>
                <p className="text-xs uppercase tracking-widest text-ink-soft/70 mb-1.5">
                  {t('rsvp.attendance')}
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {ATTENDANCE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setAttendance(opt.value)}
                      className={`rounded-xl border hairline py-2 text-xs transition-colors ${
                        attendance === opt.value ? 'bg-accent text-ink font-medium' : 'text-ink-soft hover:bg-sky/50'
                      }`}
                    >
                      {t(opt.labelKey)}
                    </button>
                  ))}
                </div>
                {errors.attendance && <p className="text-xs text-ink-soft/70 mt-1">{errors.attendance}</p>}
              </div>

              {/* Number of guests */}
              <div>
                <label htmlFor="rf-count" className="block text-xs uppercase tracking-widest text-ink-soft/70 mb-1.5">
                  {t('rsvp.guestCount')}
                </label>
                <input
                  id="rf-count"
                  type="number"
                  min={1}
                  max={10}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
                {errors.guestCount && <p className="text-xs text-ink-soft/70 mt-1">{errors.guestCount}</p>}
              </div>

              {/* Wishes / Message */}
              <div>
                <label htmlFor="rf-message" className="block text-xs uppercase tracking-widest text-ink-soft/70 mb-1.5">
                  {t('wishes.title')}
                </label>
                <textarea
                  id="rf-message"
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t('wishes.messagePlaceholder')}
                  className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full py-3 rounded-full bg-accent text-ink text-xs tracking-[0.25em] uppercase hover:bg-accent-mid transition-colors disabled:opacity-60 font-medium"
              >
                {status === 'submitting' ? t('rsvp.submitting') : t('rsvp.submit')}
              </button>

            </form>
          </Reveal>
        )}

        {/* ── Wishes list ── */}
        {wishes.length > 0 && (
          <Reveal variant="fadeIn" delay={0.2}>
            <div className="mt-12">
              <p className="text-xs uppercase tracking-[0.3em] text-center text-ink-soft/60 mb-6">
                {t('wishes.title')}
              </p>
              <div className="rounded-3xl border hairline bg-white/60 p-4">
                <div className="wishes-scroll space-y-4 overflow-y-auto pr-2" style={{ maxHeight: '360px' }}>
                  {loading && <p className="text-center text-sm text-ink-soft/60">{t('common.loading')}</p>}
                  {!loading && loadError && <p className="text-center text-sm text-ink-soft/70">{t('common.error')}</p>}
                  <AnimatePresence initial={false}>
                    {wishes.map((w) => (
                      <motion.div
                        key={w.id}
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className={`rounded-xl p-4 transition-colors duration-700 ${w.id === justSubmittedId ? 'bg-sky/60' : 'bg-transparent'}`}
                      >
                        <div className="flex items-baseline justify-between mb-1">
                          <p className="font-display text-base text-ink">{w.name}</p>
                          <p className="text-[10px] text-ink-soft/50">
                            {new Date(w.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <p className="text-sm leading-relaxed text-ink-soft/80">{w.message}</p>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </Reveal>
        )}

      </div>
    </section>
  )
}
