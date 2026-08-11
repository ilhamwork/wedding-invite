import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'

// ── CONFIG ─────────────────────────────────────────────────────────────────
const BASE_URL = 'https://adventureof-pritailham.co'
const SESSION_KEY = 'guestlist_authed'
// Value stored: 'admin' | 'Prita' | 'Om Ilham' | 'Tante Dian'
const SESSION_ROLE_KEY = 'guestlist_role'

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

// Per-undangan passwords — set via .env (VITE_PW_PRITA, etc.)
// Falls back to the shared admin password so existing setups aren't broken.
const UNDANGAN_ACCOUNTS = [
  {
    label: 'Prita',
    role: 'Prita',
    envKey: 'VITE_PW_PRITA',
  },
  {
    label: 'Om Ilham',
    role: 'Om Ilham',
    envKey: 'VITE_PW_OM_ILHAM',
  },
  {
    label: 'Tante Dian',
    role: 'Tante Dian',
    envKey: 'VITE_PW_TANTE_DIAN',
  },
  {
    label: 'Ilham',
    role: 'Ilham',
    envKey: 'VITE_PW_ILHAM',
  },
]

function resolvePassword(envKey) {
  return import.meta.env[envKey] || import.meta.env.VITE_ADMIN_PASSWORD || ''
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

const IconSent = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="20 6 9 17 4 12" />
    <polyline points="20 6 12 14 12 20 9 17" />
  </svg>
)

// ── Icons ──────────────────────────────────────────────────────────────────
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
  const [selected, setSelected] = useState(null) // null | account object | 'admin'
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [shake, setShake] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    let matched = false

    if (selected === 'admin') {
      const expected = import.meta.env.VITE_ADMIN_PASSWORD
      if (expected && pw === expected) matched = true
    } else if (selected) {
      const expected = resolvePassword(selected.envKey)
      if (expected && pw === expected) matched = true
    }

    if (matched) {
      const role = selected === 'admin' ? 'admin' : selected.role
      sessionStorage.setItem(SESSION_KEY, '1')
      sessionStorage.setItem(SESSION_ROLE_KEY, role)
      onAuthed(role)
    } else {
      setErr(true)
      setShake(true)
      setTimeout(() => setShake(false), 500)
    }
  }

  function handleBack() {
    setSelected(null)
    setPw('')
    setErr(false)
  }

  return (
    <div className="paper-texture min-h-screen flex items-center justify-center p-6 bg-linear-to-br from-[#F7F4ED] to-[#EEE9DE]">
      <div
        className={`
          w-full max-w-sm rounded-3xl p-8
          bg-[rgba(247,244,237,0.92)] backdrop-blur-xl
          border border-[rgba(201,169,110,0.35)]
          shadow-[0_12px_48px_rgba(46,58,79,0.1)]
          ${shake ? 'animate-[shake_0.4s_ease]' : ''}
          transition-all duration-300
        `}
      >
        <div className="text-center mb-6">
          <h1 className="font-display text-2xl text-[#2E3A4F] mt-3 tracking-wide">
            Guest List
          </h1>
          <p className="text-xs text-[#7A7A88] mt-1.5">
            Prita &amp; Ilham
          </p>
        </div>

        {/* Step 1 — pilih undangan */}
        {!selected && (
          <div className="space-y-2.5">
            <p className="text-[0.75rem] text-[#7A7A88] text-center mb-4 font-medium tracking-wide uppercase">
              Masuk sebagai
            </p>

            {UNDANGAN_ACCOUNTS.map((acc) => (
              <button
                key={acc.role}
                onClick={() => { setSelected(acc); setPw(''); setErr(false) }}
                className="
                  w-full flex items-center gap-3 px-4 py-3.5 rounded-xl cursor-pointer
                  bg-white/80 border border-[rgba(201,169,110,0.3)]
                  hover:bg-[rgba(201,169,110,0.08)] hover:border-[rgba(201,169,110,0.55)]
                  transition-all duration-150 group text-left
                "
              >
                <span className="flex-1 text-sm font-semibold text-[#2E3A4F] group-hover:text-[#1A2230]">
                  {acc.label}
                </span>
                <span className="text-[#C9A96E] opacity-50 group-hover:opacity-90 text-xs">→</span>
              </button>
            ))}

            {/* Admin login — less prominent */}
            <button
              onClick={() => { setSelected('admin'); setPw(''); setErr(false) }}
              className="
                w-full flex items-center justify-center gap-2 mt-1 px-4 py-2.5 rounded-xl cursor-pointer
                bg-transparent border border-dashed border-[rgba(46,58,79,0.2)]
                hover:border-[rgba(46,58,79,0.4)] hover:bg-[rgba(46,58,79,0.04)]
                transition-all duration-150 text-[0.75rem] text-[#7A7A88] font-medium
              "
            >
              <span>Masuk sebagai Admin</span>
            </button>
          </div>
        )}

        {/* Step 2 — masukkan password */}
        {selected && (
          <div>
            <button
              onClick={handleBack}
              className="
                flex items-center gap-1.5 text-[0.75rem] text-[#7A7A88]
                hover:text-[#2E3A4F] mb-4 cursor-pointer bg-transparent border-none p-0
                transition-colors duration-150
              "
            >
              ← Kembali
            </button>

            <div className="flex items-center gap-2.5 mb-5 px-4 py-3 rounded-xl bg-[rgba(201,169,110,0.08)] border border-[rgba(201,169,110,0.2)]">
              <div>
                <p className="text-[0.7rem] text-[#7A7A88] font-medium m-0">Masuk sebagai</p>
                <p className="text-sm font-bold text-[#2E3A4F] m-0">
                  {selected === 'admin' ? 'Admin' : selected.label}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="password"
                value={pw}
                autoFocus
                onChange={(e) => { setPw(e.target.value); setErr(false) }}
                placeholder="Masukkan password"
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
        )}
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
function GuestCard({ guest, index, waSent, onToggleSent, isAdmin }) {
  const [copied, setCopied] = useState(false)
  const [toggling, setToggling] = useState(false)

  const slug = toSlug(guest.name)
  const url = `${BASE_URL}/?to=${slug}`
  const waLink = buildWaLink(guest.name, url, guest.phone)
  const srcStyle = SOURCE_STYLES[guest.source] ?? SOURCE_STYLES['Prita']

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildMessage(guest.name, url))
      setCopied(true)
      toast.success('Pesan disalin!', { icon: '📋', duration: 2000 })
      setTimeout(() => setCopied(false), 2500)
    } catch {
      toast.error('Gagal menyalin')
    }
  }

  async function handleToggleSent() {
    setToggling(true)
    await onToggleSent(guest.slug, !waSent)
    setToggling(false)
  }

  return (
    <div className={`
      rounded-2xl mb-3 overflow-hidden
      backdrop-blur-md
      border
      shadow-[0_2px_10px_rgba(46,58,79,0.04)]
      transition-all duration-300
      ${waSent
        ? 'bg-[rgba(37,211,102,0.05)] border-[rgba(37,211,102,0.3)]'
        : 'bg-white/85 border-[rgba(201,169,110,0.22)]'
      }
    `}>
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
          <div className="flex items-center gap-2 min-w-0">
            <h3 className="text-[0.95rem] font-semibold text-[#1E283C] leading-snug truncate min-w-0 flex-1 m-0">
              {guest.name}
            </h3>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className={`text-[0.65rem] px-2.5 py-0.5 rounded-full font-semibold tracking-wide whitespace-nowrap ${srcStyle.badge} ${isAdmin ? '' : 'hidden'}`}>
                {guest.source}
              </span>
            </div>
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
          <span>{copied ? 'Copied!' : 'Copy'}</span>
        </button>

        {/* Toggle Sent — switch */}
        <button
          onClick={handleToggleSent}
          disabled={toggling}
          title={waSent ? 'Tandai belum terkirim' : 'Tandai sudah terkirim'}
          className={`
            flex items-center h-9 px-2 rounded-[10px] cursor-pointer
            transition-all duration-150 shrink-0
            ${toggling ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          <span className={`
            relative inline-flex w-9 h-5 rounded-full transition-colors duration-200
            ${waSent ? 'bg-[#25D366]' : 'bg-[rgba(46,58,79,0.2)]'}
          `}>
            <span className={`
              absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white
              shadow-[0_1px_3px_rgba(0,0,0,0.2)]
              transition-transform duration-200
              ${waSent ? 'translate-x-4' : 'translate-x-0'}
            `} />
          </span>
        </button>

        {/* WhatsApp CTA / Status Terkirim */}
        {waSent ? (
          <span className="flex-1 flex items-center justify-center gap-1.5 h-9 px-3.5 rounded-[10px] bg-[rgba(37,211,102,0.12)] border border-[rgba(37,211,102,0.4)] text-[#128C7E] text-[0.78rem] font-bold">
            <IconCheck />
            Terkirim
          </span>
        ) : (
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
        )}
      </div>

    </div>
  )
}

// ── Icons ── (logout)
const IconLogout = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
)

// ── Main Dashboard ─────────────────────────────────────────────────────────
function GuestDashboard({ role, onLogout }) {
  const isAdmin = role === 'admin'
  const [guests, setGuests] = useState([])
  const [sentMap, setSentMap] = useState({}) // slug → boolean
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState(null)
  const [query, setQuery] = useState('')
  // Admin sees all sources; per-undangan login is locked to their source
  const [activeSource, setActiveSource] = useState(isAdmin ? 'Semua' : role)

  useEffect(() => {
    async function fetchGuests() {
      setLoading(true)
      setFetchError(null)
      const { data, error } = await supabase
        .from('guests')
        .select('name, slug, source, phone, wa_sent')
        .order('source')
        .order('name')
      if (error) {
        setFetchError(error.message)
      } else {
        const list = data ?? []
        setGuests(list)
        const map = {}
        list.forEach((g) => { map[g.slug] = !!g.wa_sent })
        setSentMap(map)
      }
      setLoading(false)
    }
    fetchGuests()
  }, [])

  async function handleToggleSent(slug, newValue) {
    // Optimistic update
    setSentMap((prev) => ({ ...prev, [slug]: newValue }))
    const { error } = await supabase
      .from('guests')
      .update({ wa_sent: newValue })
      .eq('slug', slug)
    if (error) {
      toast.error('Gagal menyimpan status')
      // Revert
      setSentMap((prev) => ({ ...prev, [slug]: !newValue }))
    } else {
      toast.success(newValue ? 'Undangan ditandai terkirim' : 'Status dikembalikan', { duration: 2000 })
    }
  }

  const sources = isAdmin
    ? ['Semua', ...Object.keys(SOURCE_STYLES)]
    : [role]

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
            <div className="flex-1">
              <h1 className="font-display text-xl text-[#E8C99A] tracking-wide leading-tight m-0">
                Invitation — Prita &amp; Ilham
              </h1>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="
                shrink-0 flex items-center gap-1.5 h-9 px-3 rounded-xl cursor-pointer
                bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)]
                text-[rgba(232,201,154,0.7)] text-[0.75rem] font-semibold
                hover:bg-[rgba(255,80,80,0.12)] hover:border-[rgba(255,80,80,0.3)] hover:text-[#FF8080]
                transition-all duration-150
              "
            >
              <IconLogout />
              <span>Logout</span>
            </button>
          </div>

          {/* Source filter chips — admin only */}
          {isAdmin && (
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {sources.map((src) => {
              const isActive = activeSource === src
              return (
                <button
                  key={src}
                  onClick={() => setActiveSource(src)}
                  className={`
                    shrink-0 px-3.5 py-1.5 rounded-full text-[0.75rem] font-semibold
                    whitespace-nowrap border transition-all duration-200
                    ${isActive
                      ? 'bg-[rgba(201,169,110,0.3)] border-[rgba(201,169,110,0.8)] text-[#E8C99A] shadow-[0_2px_10px_rgba(201,169,110,0.2)]'
                      : 'bg-[rgba(201,169,110,0.06)] border-[rgba(201,169,110,0.2)] text-[rgba(232,201,154,0.6)] hover:bg-[rgba(201,169,110,0.12)] cursor-pointer'
                    }
                  `}
                >
                  {src} · {counts[src] ?? 0}
                </button>
              )
            })}
          </div>
          )}

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

          {/* Progress terkirim */}
          {!loading && filtered.length > 0 && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[0.7rem] font-medium">
                <span className="text-[rgba(232,201,154,0.65)]">Progress Invitation</span>
                <span className="text-[#E8C99A]">
                  {filtered.filter((g) => sentMap[g.slug]).length} / {filtered.length} terkirim
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-white/8 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-[#25D366] to-[#128C7E] transition-all duration-500"
                  style={{ width: `${filtered.length > 0 ? (filtered.filter((g) => sentMap[g.slug]).length / filtered.length) * 100 : 0}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ── Guest List ── */}
      <main className="max-w-2xl mx-auto px-4 pt-5 pb-24">
        {loading ? (
          <div className="text-center py-16 text-[#7A6F60]">
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
                  waSent={!!sentMap[guest.slug]}
                  onToggleSent={handleToggleSent}
                  isAdmin={isAdmin}
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
  const [role, setRole] = useState('admin')

  useEffect(() => {
    const isAuthed = sessionStorage.getItem(SESSION_KEY) === '1'
    const savedRole = sessionStorage.getItem(SESSION_ROLE_KEY) || 'admin'
    setAuthed(isAuthed)
    setRole(savedRole)
  }, [])

  function handleAuthed(resolvedRole) {
    setRole(resolvedRole)
    setAuthed(true)
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY)
    sessionStorage.removeItem(SESSION_ROLE_KEY)
    setAuthed(false)
    setRole('admin')
  }

  if (!authed) return <LoginGate onAuthed={handleAuthed} />
  return <GuestDashboard role={role} onLogout={handleLogout} />
}
