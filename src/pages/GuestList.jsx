import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'

// ── CONFIG ─────────────────────────────────────────────────────────────────
const BASE_URL = 'https://adventureof-pritailham.co'
const SESSION_KEY = 'guestlist_authed'

const SOURCE_STYLES = {
  Prita: {
    badge: 'bg-[rgba(201,169,110,0.12)] border border-[rgba(201,169,110,0.35)] text-[#B8944F]',
  },
  'Om Ilham': {
    badge: 'bg-[rgba(46,58,79,0.12)] border border-[rgba(46,58,79,0.35)] text-[#4A5F7A]',
  },
  'Tante Dian': {
    badge: 'bg-[rgba(74,69,64,0.12)] border border-[rgba(74,69,64,0.30)] text-[#7A6F60]',
  },
}

// ── Helpers ────────────────────────────────────────────────────────────────
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, '')
    .replace(/\./g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function buildMessage(name, url) {
  return `Kepada Yth,
${name}

Bismillahirrahmanirrahim.
Assalamualaikum warrahmatullahi wabarakatuh,

Dengan memohon rahmat dan ridho Allah SWT, tanpa mengurangi rasa hormat, perkenankan kami mengundang Bapak/Ibu/Sdr/i untuk hadir di acara pernikahan kami yang akan diselenggarakan pada:

🗓️ Sabtu, 5 September 2026
⏰ 18:30 - 21:00 WIB
📍 *Auditorium BKKBN Halim*

Kami sangat berharap Bapak/Ibu/Sdr/i dapat *mengonfirmasi kehadiran* melalui undangan ini

${url}

Merupakan sebuah kebahagiaan bagi kami apabila Bapak/Ibu/Sdr/i berkenan untuk hadir dan memberikan doa restu. Tiada yang dapat kami ungkapkan selain rasa terima kasih dari hati tulus yang terdalam.

Wassalamualaikum warrahmatullah wabarakatuh.

Kami yang berbahagia,
*Prita & Ilham*`
}

function normalizePhone(phone) {
  if (!phone) return null
  let digits = String(phone).replace(/\D/g, '')
  if (digits.startsWith('0')) digits = '62' + digits.slice(1)
  if (!digits.startsWith('62')) digits = '62' + digits
  return digits
}

function buildWaLink(name, url, phone) {
  const normalized = normalizePhone(phone)
  const text = encodeURIComponent(buildMessage(name, url))
  return normalized
    ? `https://wa.me/${normalized}?text=${text}`
    : `https://wa.me/?text=${text}`
}

// ── Icons ──────────────────────────────────────────────────────────────────
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
  </svg>
)

const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IconWhatsApp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
  </svg>
)

// ── Login Gate ─────────────────────────────────────────────────────────────
function LoginGate({ onAuthed }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    const expected = import.meta.env.VITE_ADMIN_PASSWORD
    if (expected && pw === expected) {
      sessionStorage.setItem(SESSION_KEY, '1')
      onAuthed()
    } else {
      setErr(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-[#F7F4ED] to-[#EEE9DE]">
      <div
        className={`
          w-full max-w-sm rounded-3xl p-10
          bg-[rgba(247,244,237,0.88)] backdrop-blur-xl
          border border-[rgba(201,169,110,0.35)]
          shadow-[0_12px_48px_rgba(46,58,79,0.1)]
          ${shake ? 'animate-[shake_0.4s_ease]' : ''}
        `}
      >
        <div className="text-center mb-6">
          <span className="text-4xl">💍</span>
          <h1 className="font-display text-2xl text-[#2E3A4F] mt-3 tracking-wide">
            Guest List Login
          </h1>
          <p className="text-xs text-[#7A7A88] mt-1.5">
            Prita &amp; Ilham · 5 September 2026
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="password"
            value={pw}
            autoFocus
            onChange={(e) => { setPw(e.target.value); setErr(false) }}
            placeholder="Masukkan password admin"
            className={`
              w-full rounded-xl px-4 py-3 text-sm text-[#2E3A4F] outline-none
              border transition-colors duration-200
              ${err
                ? 'bg-[rgba(180,60,60,0.05)] border-[rgba(180,60,60,0.4)]'
                : 'bg-white/80 border-[rgba(201,169,110,0.35)] focus:border-[rgba(201,169,110,0.65)]'
              }
            `}
          />

          {err && (
            <p className="text-xs text-[#B04040]">Password kurang tepat. Coba lagi.</p>
          )}

          <button
            type="submit"
            className="
              w-full mt-2 py-3 rounded-xl
              bg-linear-to-br from-accent to-[#B8944F]
              text-white text-sm font-bold tracking-widest uppercase
              shadow-[0_4px_14px_rgba(201,169,110,0.3)]
              hover:opacity-90 transition-opacity duration-200 cursor-pointer
            "
          >
            Masuk
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}

// ── Guest Card ─────────────────────────────────────────────────────────────
function GuestCard({ guest, index }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const slug = toSlug(guest.name)
  const url = `${BASE_URL}/?to=${slug}`
  const message = buildMessage(guest.name, url)
  const waLink = buildWaLink(guest.name, url, guest.phone)
  const srcStyle = SOURCE_STYLES[guest.source] ?? SOURCE_STYLES['Prita']

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(message)
      setCopied(true)
      toast.success('Pesan disalin!', { icon: '📋', duration: 2000 })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Gagal menyalin')
    }
  }

  return (
    <div className="
      rounded-2xl mb-3 overflow-hidden
      bg-white/85 backdrop-blur-md
      border border-[rgba(201,169,110,0.22)]
      shadow-[0_2px_10px_rgba(46,58,79,0.04)]
      transition-all duration-200
    ">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-3.5 pb-2.5">
        {/* Index badge */}
        <div className="
          shrink-0 w-8 h-8 mt-0.5 rounded-[10px]
          flex items-center justify-center
          bg-[rgba(201,169,110,0.1)] border-[1.5px] border-[rgba(201,169,110,0.35)]
          text-[#7A6F60] font-bold text-[0.75rem]
        ">
          #{index + 1}
        </div>

        {/* Name + badge + URL */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <h3 className="text-[0.95rem] font-semibold text-[#1E283C] leading-snug wrap-break-word m-0">
              {guest.name}
            </h3>
            <span className={`text-[0.65rem] px-2.5 py-0.5 rounded-full font-semibold tracking-wide whitespace-nowrap shrink-0 ${srcStyle.badge}`}>
              {guest.source}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-1.5 text-[0.72rem] text-[#6B7280]">
            <span className="opacity-70 text-[0.75rem]">🔗</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#4A5F7A] font-medium truncate hover:underline"
            >
              {url.replace('https://', '')}
            </a>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="
        flex items-center gap-2 px-4 pt-2 pb-3
        border-t border-dashed border-[rgba(201,169,110,0.18)]
        bg-[rgba(247,244,237,0.4)]
      ">
        {/* Preview toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          title="Pratinjau Pesan WA"
          className={`
            flex items-center gap-1.5 h-9 px-3 rounded-[10px] cursor-pointer
            border text-[0.75rem] font-semibold text-[#2E3A4F]
            transition-all duration-150
            ${expanded
              ? 'bg-[rgba(46,58,79,0.12)] border-[rgba(46,58,79,0.15)]'
              : 'bg-[rgba(46,58,79,0.06)] border-[rgba(46,58,79,0.15)] hover:bg-[rgba(46,58,79,0.1)]'
            }
          `}
        >
          <IconEye />
          <span>Pesan</span>
        </button>

        {/* Copy */}
        <button
          onClick={handleCopy}
          title="Salin Teks Pesan"
          className={`
            flex items-center gap-1.5 h-9 px-3 rounded-[10px] cursor-pointer
            border text-[0.75rem] font-semibold
            transition-all duration-150
            ${copied
              ? 'bg-[rgba(37,211,102,0.12)] border-[rgba(37,211,102,0.35)] text-[#128C7E]'
              : 'bg-[rgba(201,169,110,0.1)] border-[rgba(201,169,110,0.3)] text-[#B8944F] hover:bg-[rgba(201,169,110,0.15)]'
            }
          `}
        >
          {copied ? <IconCheck /> : <IconCopy />}
          <span>{copied ? 'Tersalin!' : 'Salin'}</span>
        </button>

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="
            flex-1 flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[10px]
            bg-linear-to-br from-[#25D366] to-[#128C7E]
            text-white text-[0.78rem] font-bold tracking-wide no-underline
            shadow-[0_3px_10px_rgba(37,211,102,0.25)]
            hover:opacity-90 transition-opacity duration-150
          "
        >
          <IconWhatsApp />
          <span>Kirim WA</span>
        </a>
      </div>

      {/* Message Preview */}
      {expanded && (
        <div className="border-t border-[rgba(201,169,110,0.15)] bg-[#F7F4ED] px-4 py-3">
          <p className="text-[0.68rem] font-semibold text-[#7A6F60] mb-1.5 tracking-wider uppercase">
            Preview Pesan WhatsApp:
          </p>
          <pre className="
            font-[inherit] text-[0.75rem] text-[#33302B] leading-relaxed
            whitespace-pre-wrap wrap-break-word m-0
            max-h-44 overflow-y-auto
            bg-white/70 px-3 py-2.5 rounded-lg
            border border-[rgba(201,169,110,0.2)]
          ">
            {message}
          </pre>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
function GuestDashboard() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [query, setQuery] = useState('')
  const [activeSource, setActiveSource] = useState('Semua')

  useEffect(() => {
    async function fetchGuests() {
      setLoading(true)
      setFetchError(null)
      const { data, error } = await supabase
        .from('guests')
        .select('name, slug, source, phone')
        .order('source')
        .order('name')
      if (error) {
        setFetchError(error.message)
      } else {
        setGuests(data ?? [])
      }
      setLoading(false)
    }
    fetchGuests()
  }, [])

  const sources = ['Semua', ...Object.keys(SOURCE_STYLES)]

  const counts = useMemo(() => {
    const c = { Semua: guests.length }
    Object.keys(SOURCE_STYLES).forEach((src) => {
      c[src] = guests.filter((g) => g.source === src).length
    })
    return c
  }, [guests])

  const filtered = useMemo(() => {
    return guests.filter((g) => {
      const matchSource = activeSource === 'Semua' || g.source === activeSource
      const matchQuery = g.name.toLowerCase().includes(query.toLowerCase())
      return matchSource && matchQuery
    })
  }, [guests, query, activeSource])

  return (
    <div className="paper-texture min-h-screen bg-gradient-to-[160deg] from-[#F7F4ED] to-[#EEE9DE]">

      {/* ── Sticky Header ── */}
      <header className="
        sticky top-0 z-50 px-4 pt-6 pb-4.5
        bg-linear-to-br from-[rgba(26,33,48,0.96)] to-[rgba(15,20,32,0.98)]
        backdrop-blur-xl border-b border-[rgba(201,169,110,0.25)]
        shadow-[0_8px_32px_rgba(0,0,0,0.15)]
      ">
        <div className="max-w-2xl mx-auto space-y-3.5">

          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="
              shrink-0 w-10 h-10 rounded-xl text-xl
              flex items-center justify-center
              bg-[rgba(201,169,110,0.15)] border border-[rgba(201,169,110,0.3)]
            ">
              💍
            </div>
            <div>
              <h1 className="font-display text-xl text-[#E8C99A] tracking-wide leading-tight m-0">
                WA Blast — Prita &amp; Ilham
              </h1>
              <p className="text-[0.72rem] text-[rgba(232,201,154,0.65)] mt-0.5 m-0">
                Sabtu, 5 September 2026 · Auditorium BKKBN Halim
              </p>
            </div>
          </div>

          {/* Source filter chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sources.map((src) => {
              const isActive = activeSource === src
              return (
                <button
                  key={src}
                  onClick={() => setActiveSource(src)}
                  className={`
                    shrink-0 px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold
                    whitespace-nowrap border cursor-pointer transition-all duration-200
                    ${isActive
                      ? 'bg-[rgba(201,169,110,0.3)] border-[rgba(201,169,110,0.8)] text-[#E8C99A] shadow-[0_2px_10px_rgba(201,169,110,0.2)]'
                      : 'bg-[rgba(201,169,110,0.06)] border-[rgba(201,169,110,0.2)] text-[rgba(232,201,154,0.6)] hover:bg-[rgba(201,169,110,0.12)]'
                    }
                  `}
                >
                  {src} · {counts[src]}
                </button>
              )
            })}
          </div>

          {/* Search */}
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.85rem] opacity-70 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Cari nama tamu... (${filtered.length} tamu)`}
              className="
                w-full rounded-xl py-2.5 pl-9 pr-9 text-sm text-[#E8E4D9] outline-none
                bg-white/[0.07] border border-[rgba(201,169,110,0.25)]
                focus:border-[rgba(201,169,110,0.65)] transition-colors duration-200
              "
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="
                  absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer
                  bg-transparent border-none text-[rgba(232,201,154,0.6)]
                  text-[0.8rem] p-1 hover:text-[rgba(232,201,154,0.9)]
                "
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Guest List ── */}
      <main className="max-w-2xl mx-auto px-4 pt-5 pb-24">
        {loading ? (
          <div className="text-center py-16 text-[#7A6F60]">
            <p className="text-3xl mb-3 animate-pulse">💍</p>
            <p className="text-sm font-medium">Memuat daftar tamu...</p>
          </div>
        ) : fetchError ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">⚠️</p>
            <p className="text-[0.95rem] font-medium text-[#B04040]">Gagal memuat data</p>
            <p className="text-[0.78rem] text-[#7A6F60] mt-1">{fetchError}</p>
          </div>
        ) : (
          <>
            {filtered.length > 0 && (
              <p className="text-right text-[0.75rem] text-[#7A6F60] font-medium mb-3.5 px-1">
                Menampilkan {filtered.length} tamu
              </p>
            )}

            {filtered.length === 0 ? (
              <div className="text-center py-16 text-[#9E9E9E]">
                <p className="text-4xl mb-2">🔍</p>
                <p className="text-[0.95rem] font-medium">Tidak ada tamu ditemukan</p>
                <p className="text-[0.78rem] text-[#B8944F] mt-1">
                  Coba kata kunci lain atau ganti kategori filter
                </p>
              </div>
            ) : (
              filtered.map((guest, i) => (
                <GuestCard
                  key={`${guest.name}::${guest.source}`}
                  guest={guest}
                  index={i}
                />
              ))
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center px-4 pb-10 pt-5 text-[0.75rem] text-[#7A6F60] border-t border-[rgba(201,169,110,0.15)]">
        {guests.length} tamu terdaftar · Prita &amp; Ilham 2026
      </footer>
    </div>
  )
}

// ── Page Entry ─────────────────────────────────────────────────────────────
export default function GuestList() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(sessionStorage.getItem(SESSION_KEY) === '1')
  }, [])

  if (!authed) return <LoginGate onAuthed={() => setAuthed(true)} />
  return <GuestDashboard />
}
