import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import Section, { Reveal } from './ui/Section'

const ATTENDANCE_OPTIONS = [
  { value: 'attending', labelKey: 'rsvp.attending' },
  { value: 'not_attending', labelKey: 'rsvp.notAttending' },
]

export default function RSVP({ guestName }) {
  const { t } = useTranslation()
  const [name, setName] = useState(guestName || '')
  const [attendance, setAttendance] = useState('attending')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success

  function validate() {
    const next = {}
    if (!name.trim()) next.name = t('rsvp.errors.nameRequired')
    if (!attendance) next.attendance = t('rsvp.errors.attendanceRequired')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'submitting') return
    if (!validate()) return

    setStatus('submitting')
    try {
      if (!isSupabaseConfigured) throw new Error('Supabase not configured')
      const { error } = await supabase.from('rsvps').insert({
        guest_name: name.trim(),
        attendance_status: attendance,
        guest_count: attendance === 'attending' ? guestCount : 0,
        message: message.trim() || null,
      })
      if (error) throw error
      setStatus('success')
    } catch (err) {
      console.error(err)
      setStatus('idle')
      toast.error(t('rsvp.errorBody'))
    }
  }

  if (status === 'success') {
    return (
      <Section id="rsvp" bg="texture" flip={false} fadeTop="#F7F4ED" fadeBottom="#EEE9DE">
        <Reveal variant="fadeIn" className="text-center">
          <h2 className="font-display text-2xl text-sea mb-2">{t('rsvp.successTitle')}</h2>
          <p className="text-sm text-sea-light">{t('rsvp.successBody')}</p>
        </Reveal>
      </Section>
    )
  }

  return (
    <Section id="rsvp" bg="texture" flip={false} fadeTop="#F7F4ED" fadeBottom="#EEE9DE">
      <Reveal variant="slideRight">
        <h2 className="font-display text-2xl text-center text-sea mb-8">{t('rsvp.title')}</h2>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {/* Name */}
          <div>
            <label htmlFor="rsvp-name" className="block text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">
              {t('rsvp.name')}
            </label>
            <input
              id="rsvp-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('rsvp.namePlaceholder')}
              className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            {errors.name && <p className="text-xs text-sea-light/55 mt-1">{errors.name}</p>}
          </div>

          {/* Attendance — 2 options only */}
          <div>
            <p className="text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">{t('rsvp.attendance')}</p>
            <div className="grid grid-cols-2 gap-2">
              {ATTENDANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAttendance(opt.value)}
                  className={`rounded-xl border hairline py-2.5 text-xs transition-colors ${attendance === opt.value ? 'bg-accent text-ink' : 'text-sea-light hover:bg-sky/50'
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
                    className={`rounded-xl border hairline py-2.5 text-xs transition-colors ${
                      guestCount === num ? 'bg-accent text-ink' : 'text-sea-light hover:bg-sky/50'
                    }`}
                  >
                    {num} {num === 1 ? 'Orang' : 'Orang'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label htmlFor="rsvp-message" className="block text-xs uppercase tracking-widest text-sea-light/55 mb-1.5">
              {t('rsvp.message')}
            </label>
            <textarea
              id="rsvp-message"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t('rsvp.messagePlaceholder')}
              className="w-full rounded-xl border hairline bg-pebble/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full py-3 rounded-full bg-accent text-ink text-xs tracking-[0.25em] uppercase hover:bg-accent-mid transition-colors disabled:opacity-60 font-medium"
          >
            {status === 'submitting' ? t('rsvp.submitting') : t('rsvp.submit')}
          </button>
        </form>
      </Reveal>
    </Section>
  )
}
