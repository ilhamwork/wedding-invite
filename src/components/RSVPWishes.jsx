import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const PAGE_SIZE = 50

const ATTENDANCE_OPTIONS = [
  { value: 'attending', labelKey: 'rsvp.attending' },
  { value: 'not_attending', labelKey: 'rsvp.notAttending' },
]

function toSlug(name) {
  if (!name) return ''
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export default function RSVPWishes({ guestName }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language?.startsWith('en') ? 'en-US' : 'id-ID'

  // Form state
  const [name, setName] = useState(guestName || '')
  const [attendance, setAttendance] = useState('attending')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success

  // Wishes list state
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [justSubmittedId, setJustSubmittedId] = useState(null)

  // Check if guest already submitted an RSVP
  useEffect(() => {
    if (!guestName || !isSupabaseConfigured) return
    supabase
      .from('rsvps')
      .select('id', { count: 'exact', head: true })
      .ilike('guest_name', guestName.trim())
      .then(({ count }) => {
        if (count && count > 0) setStatus('success')
      })
  }, [guestName])

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
    if (!name.trim()) next.name = t('rsvp.errors.nameRequired')
    if (!attendance) next.attendance = t('rsvp.errors.attendanceRequired')
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
      const trimmedName = name.trim()
      const { error: rsvpError } = await supabase.from('rsvps').insert({
        guest_name: trimmedName,
        attendance_status: attendance,
        guest_count: attendance === 'attending' ? guestCount : 0,
        message: message.trim() || null,
      })
      if (rsvpError) throw rsvpError

      // Auto-set wa_sent to true in guests table if matching guest exists
      const gSlug = toSlug(trimmedName)
      await supabase
        .from('guests')
        .update({ wa_sent: true })
        .or(`slug.eq.${gSlug},name.ilike.${trimmedName}`)

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
    <section id="rsvp-wishes" className="relative" style={{ backgroundColor: '#EEE9DE' }}>
      <div className="relative px-6 sm:px-10 py-20 sm:py-24 max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-display text-2xl md:text-3xl text-center text-sea mb-10">
            {t('rsvp.title')}
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
          {/* ── Form Column ── */}
          <div>
            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col items-center justify-center text-center bg-white/60 rounded-3xl border hairline p-10"
              >
                <p className="font-display text-xl text-sea mb-2">{t('rsvp.successTitle')}</p>
                <p className="text-sm text-sea-light">{t('rsvp.successBody')}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              >
                <form onSubmit={handleSubmit} noValidate className="space-y-5 bg-white/40 rounded-3xl border hairline p-6">

                  {/* Name */}
                  <div>
                    <label htmlFor="rf-name" className="block text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">
                      {t('rsvp.name')}
                    </label>
                    <input
                      id="rf-name"
                      type="text"
                      value={name}
                      onChange={(e) => !guestName && setName(e.target.value)}
                      readOnly={!!guestName}
                      placeholder={t('rsvp.namePlaceholder')}
                      className={`w-full rounded-xl border hairline px-4 py-2.5 text-sm focus:outline-none ${
                        guestName
                          ? 'bg-pebble/20 text-sea-light/70 cursor-default select-none'
                          : 'bg-pebble/40 focus:ring-2 focus:ring-accent/30'
                      }`}
                    />
                    {errors.name && <p className="text-xs text-sea-light/55 mt-1">{errors.name}</p>}
                  </div>

                  {/* Attendance */}
                  <div>
                    <p className="text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">
                      {t('rsvp.attendance')}
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {ATTENDANCE_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setAttendance(opt.value)}
                          className={`rounded-xl border hairline py-2.5 text-xs transition-colors ${attendance === opt.value ? 'bg-accent text-ink font-medium' : 'text-sea-light hover:bg-sky/50'
                            }`}
                        >
                          {t(opt.labelKey)}
                        </button>
                      ))}
                    </div>
                    {errors.attendance && <p className="text-xs text-sea-light/55 mt-1">{errors.attendance}</p>}
                  </div>

                  {/* Guest Count */}
                  {attendance === 'attending' && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">{t('rsvp.guestCount', 'Jumlah Tamu')}</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[1, 2].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setGuestCount(num)}
                            className={`rounded-xl border hairline py-2.5 text-xs transition-colors ${guestCount === num ? 'bg-accent text-ink font-medium' : 'text-sea-light hover:bg-sky/50'
                              }`}
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wishes / Message */}
                  <div>
                    <label htmlFor="rf-message" className="block text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">
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
              </motion.div>
            )}
          </div>

          {/* ── Wishes List Column ── */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
            >
              <div className="rounded-3xl border hairline bg-white/60 p-6">
                <h3 className="font-display text-lg text-sea mb-4">{t('wishes.title')}</h3>
                <div className="wishes-scroll overflow-y-auto pr-2" style={{ maxHeight: '420px' }}>
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
                        className={`px-2 py-2.5 transition-colors duration-700 ${w.id === justSubmittedId ? 'bg-sky/60 rounded-xl' : ''}`}
                      >
                        <div className="flex items-baseline justify-between gap-2 mb-0.5">
                          <p className="font-display text-sm text-sea font-medium">{w.name}</p>
                          <p className="text-[10px] text-sea-light/55 shrink-0">
                            {new Date(w.created_at).toLocaleDateString(lang, { day: 'numeric', month: 'short' })}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed text-sea-light">{w.message}</p>
                        <div className="mt-2.5 h-px bg-ink/6" />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>
  )
}
