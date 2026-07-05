import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { useTranslation } from 'react-i18next'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { LeafMonogram } from '../components/ui/Ornaments'

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
      <div className="max-w-sm w-full text-center rounded-3xl border hairline bg-paper/60 p-8">
        <LeafMonogram className="w-12 h-12 mx-auto mb-5" />
        <p className="section-label mb-1">{t('checkin.title')}</p>
        <p className="text-xs text-ink-soft/60 mb-6">{t('checkin.subtitle')}</p>

        {status === 'loading' && <p className="text-sm text-ink-soft/60">{t('common.loading')}</p>}
        {status === 'error' && <p className="text-sm text-rust">{t('admin.guestNotFound')}</p>}

        {status === 'found' && (
          <>
            <div className="bg-cream inline-block p-4 rounded-2xl border hairline mb-5">
              <QRCodeSVG value={guest.id} size={180} fgColor="#1F2D3D" bgColor="#FAF6EE" />
            </div>
            <p className="text-xs uppercase tracking-widest text-ink-soft/60 mb-1">
              {t('checkin.guestName')}
            </p>
            <p className="font-display text-xl text-ink">{guest.guest_name}</p>
          </>
        )}
      </div>
    </div>
  )
}
