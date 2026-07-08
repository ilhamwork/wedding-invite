import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'

const ease = [0.22, 1, 0.36, 1]

export default function GuestCheckIn() {
  const { id } = useParams()
  const { t } = useTranslation()
  const [guest, setGuest] = useState(null)
  const [status, setStatus] = useState('loading') // loading | found | error

  useEffect(() => {
    let cancelled = false
    async function load() {
      if (!isSupabaseConfigured) {
        setStatus('error')
        return
      }
      const { data, error } = await supabase
        .from('rsvps')
        .select('id, guest_name')
        .eq('id', id)
        .single()

      if (cancelled) return
      if (error || !data) {
        setStatus('error')
        return
      }
      setGuest(data)
      setStatus('found')
    }
    load()
    return () => {
      cancelled = true
    }
  }, [id])

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-6">
      <motion.div
        className="max-w-sm w-full text-center rounded-3xl border hairline bg-pebble/60 p-8"
        initial={{ opacity: 0, y: 32, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease }}
      >
        <p className="section-label mb-1">{t('checkin.title')}</p>
        <p className="text-xs text-ink-soft/60 mb-6">{t('checkin.subtitle')}</p>

        {status === 'loading' && <p className="text-sm text-ink-soft/60">{t('common.loading')}</p>}
        {status === 'error' && <p className="text-sm text-sea-light">{t('admin.guestNotFound')}</p>}

        {status === 'found' && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.2 }}
          >
            <div className="bg-mist inline-block p-4 rounded-2xl border hairline mb-5">
              <QRCodeSVG value={guest.id} size={180} fgColor="#0D2B45" bgColor="#EDF6FD" />
            </div>
            <p className="text-xs uppercase tracking-widest text-ink-soft/60 mb-1">
              {t('checkin.guestName')}
            </p>
            <p className="font-display text-xl text-ink">{guest.guest_name}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
