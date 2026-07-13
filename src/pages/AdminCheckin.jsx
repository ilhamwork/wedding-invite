import { useEffect, useState, useCallback } from 'react'
import { Scanner } from '@yudiel/react-qr-scanner'
import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const SESSION_KEY = 'admin_authed'

function AdminLoginForm({ onAuthed }) {
  const { t } = useTranslation()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const expected = import.meta.env.VITE_ADMIN_PASSWORD
    if (expected && password === expected) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onAuthed()
    } else {
      setError(true)
    }
  }

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-6">
      <form onSubmit={handleSubmit} className="max-w-xs w-full rounded-3xl border hairline bg-pebble/60 p-8">
        <h1 className="font-display text-2xl text-ink text-center mb-6">{t('admin.loginTitle')}</h1>
        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          placeholder={t('admin.password')}
          className="w-full rounded-xl border hairline bg-mist px-4 py-2.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-sea-light/40"
        />
        {error && <p className="text-xs text-sea-light mb-3">{t('admin.loginError')}</p>}
        <button
          type="submit"
          className="w-full mt-3 py-2.5 rounded-full bg-accent text-cream text-xs tracking-[0.2em] uppercase hover:bg-accent-mid transition-colors"
        >
          {t('admin.login')}
        </button>
      </form>
    </div>
  )
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-2xl border hairline bg-pebble/50 p-4 text-center">
      <p className="font-display text-2xl text-sea-light">{value}</p>
      <p className="text-[10px] uppercase tracking-widest text-ink-soft/60 mt-1">{label}</p>
    </div>
  )
}

function Dashboard() {
  const { t } = useTranslation()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      if (!isSupabaseConfigured) return
      const [rsvps, wishes] = await Promise.all([
        supabase.from('rsvps').select('attendance_status'),
        supabase.from('wishes').select('id', { count: 'exact', head: true }),
      ])
      const rows = rsvps.data ?? []
      setStats({
        total: rows.length,
        attending: rows.filter((r) => r.attendance_status === 'attending').length,
        notAttending: rows.filter((r) => r.attendance_status === 'not_attending').length,
        maybe: rows.filter((r) => r.attendance_status === 'maybe').length,
        wishes: wishes.count ?? 0,
      })
    }
    load()
  }, [])

  if (!stats) return null

  return (
    <div className="grid grid-cols-2 gap-3 mb-8">
      <StatCard label={t('admin.totalRsvp')} value={stats.total} />
      <StatCard label={t('admin.attending')} value={stats.attending} />
      <StatCard label={t('admin.notAttending')} value={stats.notAttending} />
      <StatCard label={t('admin.maybe')} value={stats.maybe} />
      <StatCard label={t('admin.totalWishes')} value={stats.wishes} />
    </div>
  )
}

function QRScanner() {
  const { t } = useTranslation()
  const [lastResult, setLastResult] = useState(null)

  const handleScan = useCallback(async (detected) => {
    const raw = detected?.[0]?.rawValue
    if (!raw || raw === lastResult) return
    setLastResult(raw)

    const { data: existing } = await supabase
      .from('checkins')
      .select('id')
      .eq('guest_id', raw)
      .maybeSingle()

    if (existing) {
      toast(t('admin.alreadyCheckedIn'))
      return
    }

    const { error } = await supabase.from('checkins').insert({
      guest_id: raw,
      checked_in_by: 'admin',
    })

    if (error) {
      toast.error(t('admin.guestNotFound'))
    } else {
      toast.success(t('admin.checkedIn'))
    }
  }, [lastResult, t])

  return (
    <div>
      <h2 className="font-display text-xl text-ink mb-2">{t('admin.scanTitle')}</h2>
      <p className="text-xs text-ink-soft/60 mb-4">{t('admin.scanHint')}</p>
      <div className="rounded-2xl overflow-hidden border hairline">
        <Scanner onScan={handleScan} constraints={{ facingMode: 'environment' }} />
      </div>
    </div>
  )
}

export default function AdminCheckin() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === '1')
  }, [])

  if (!authed) return <AdminLoginForm onAuthed={() => setAuthed(true)} />

  return (
    <div className="paper-texture min-h-screen p-6 max-w-md mx-auto">
      <h1 className="font-display text-2xl text-ink text-center mb-6">{'Admin'}</h1>
      <Dashboard />
      <QRScanner />
    </div>
  )
}
