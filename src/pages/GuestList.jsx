import { useState, useMemo, useEffect } from 'react'
import toast from 'react-hot-toast'
import { GUEST_DATA } from '../data/guests'

// ── CONFIG ─────────────────────────────────────────────────────────────────
const BASE_URL = 'https://adventureof-pritailham.co'
const SESSION_KEY = 'guestlist_authed'

const SOURCE_COLORS = {
  Prita: { bg: 'rgba(201,169,110,0.12)', border: 'rgba(201,169,110,0.35)', text: '#B8944F' },
  'Om Ilham': { bg: 'rgba(46,58,79,0.12)', border: 'rgba(46,58,79,0.35)', text: '#4A5F7A' },
  'Tante Dian': { bg: 'rgba(74,69,64,0.12)', border: 'rgba(74,69,64,0.30)', text: '#7A6F60' },
}

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
  // Strip semua karakter non-digit
  let digits = String(phone).replace(/\D/g, '')
  // Ubah awalan 0 → 62, pastikan sudah 62
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
    <div
      className="paper-texture min-h-screen flex items-center justify-center p-6"
      style={{ background: 'linear-gradient(135deg, #F7F4ED 0%, #EEE9DE 100%)' }}
    >
      <div
        style={{
          background: 'rgba(247,244,237,0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(201,169,110,0.35)',
          borderRadius: 24,
          padding: '44px 36px',
          maxWidth: 400,
          width: '100%',
          boxShadow: '0 12px 48px rgba(46,58,79,0.1)',
          animation: shake ? 'shake 0.4s ease' : 'none',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span style={{ fontSize: 40 }}>💍</span>
          <h1
            className="font-display"
            style={{ fontSize: '1.5rem', color: '#2E3A4F', marginTop: 12, letterSpacing: '0.02em' }}
          >
            Guest List Login
          </h1>
          <p style={{ fontSize: '0.8rem', color: '#7A7A88', marginTop: 6 }}>
            Prita &amp; Ilham · 5 September 2026
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            id="gl-password"
            type="password"
            value={pw}
            autoFocus
            onChange={(e) => {
              setPw(e.target.value)
              setErr(false)
            }}
            placeholder="Masukkan password admin"
            style={{
              width: '100%',
              background: err ? 'rgba(180,60,60,0.05)' : 'rgba(255,255,255,0.8)',
              border: `1px solid ${err ? 'rgba(180,60,60,0.4)' : 'rgba(201,169,110,0.35)'}`,
              borderRadius: 12,
              padding: '12px 16px',
              fontSize: '0.9rem',
              color: '#2E3A4F',
              outline: 'none',
              transition: 'border-color 0.2s',
              marginBottom: 8,
              boxSizing: 'border-box',
            }}
          />
          {err && (
            <p style={{ fontSize: '0.78rem', color: '#B04040', marginBottom: 12 }}>
              Password kurang tepat. Coba lagi.
            </p>
          )}
          <button
            type="submit"
            style={{
              width: '100%',
              marginTop: 8,
              background: 'linear-gradient(135deg, #C9A96E 0%, #B8944F 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: 12,
              padding: '12px',
              fontSize: '0.85rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(201,169,110,0.3)',
              transition: 'opacity 0.2s',
            }}
            onMouseEnter={(e) => (e.target.style.opacity = '0.9')}
            onMouseLeave={(e) => (e.target.style.opacity = '1')}
          >
            Masuk Dashboard
          </button>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
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
  const srcColor = SOURCE_COLORS[guest.source] || SOURCE_COLORS['Prita']

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
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.85)',
        border: '1px solid rgba(201,169,110,0.22)',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: '0 2px 10px rgba(46,58,79,0.04)',
      }}
    >
      {/* Top Header Row inside Card: Index + Name + Source Tag */}
      <div
        style={{
          padding: '14px 16px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        {/* Index indicator */}
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(201,169,110,0.1)',
            border: '1.5px solid rgba(201,169,110,0.35)',
            color: '#7A6F60',
            fontWeight: 700,
            fontSize: '0.75rem',
            marginTop: 2,
          }}
        >
          {`#${index + 1}`}
        </div>

        {/* Guest Name & Category Badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
              flexWrap: 'wrap',
            }}
          >
            <h3
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                fontWeight: 600,
                color: '#1E283C',
                lineHeight: 1.35,
                margin: 0,
                wordBreak: 'break-word',
              }}
            >
              {guest.name}
            </h3>

            <span
              style={{
                fontSize: '0.65rem',
                padding: '2px 9px',
                borderRadius: 20,
                background: srcColor.bg,
                border: `1px solid ${srcColor.border}`,
                color: srcColor.text,
                fontWeight: 600,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {guest.source}
            </span>
          </div>

          {/* Invitation URL Bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              marginTop: 6,
              fontSize: '0.72rem',
              color: '#6B7280',
            }}
          >
            <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>🔗</span>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#4A5F7A',
                textDecoration: 'none',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                fontWeight: 500,
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = 'underline')}
              onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
            >
              {url.replace('https://', '')}
            </a>
          </div>
        </div>
      </div>

      {/* Card Action Buttons Row */}
      <div
        style={{
          padding: '8px 16px 12px',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderTop: '1px dashed rgba(201,169,110,0.18)',
          background: 'rgba(247,244,237,0.4)',
        }}
      >
        {/* Preview message toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          title="Pratinjau Pesan WA"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 10,
            background: expanded ? 'rgba(46,58,79,0.12)' : 'rgba(46,58,79,0.06)',
            border: '1px solid rgba(46,58,79,0.15)',
            color: '#2E3A4F',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            height: 36,
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2E3A4F" strokeWidth="2.2">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <span>Pesan</span>
        </button>

        {/* Copy text */}
        <button
          onClick={handleCopy}
          title="Salin Teks Pesan"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 12px',
            borderRadius: 10,
            background: copied ? 'rgba(37,211,102,0.12)' : 'rgba(201,169,110,0.1)',
            border: `1px solid ${copied ? 'rgba(37,211,102,0.35)' : 'rgba(201,169,110,0.3)'}`,
            color: copied ? '#128C7E' : '#B8944F',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            height: 36,
          }}
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#128C7E" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Tersalin!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#B8944F" strokeWidth="2.2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
              </svg>
              <span>Salin</span>
            </>
          )}
        </button>

        {/* WhatsApp Send button (Primary CTA) */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            padding: '7px 14px',
            height: 36,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#FFF',
            fontSize: '0.78rem',
            fontWeight: 700,
            textDecoration: 'none',
            letterSpacing: '0.02em',
            boxShadow: '0 3px 10px rgba(37,211,102,0.25)',
            transition: 'all 0.15s ease',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z" />
          </svg>
          <span>Kirim WA</span>
        </a>
      </div>

      {/* Expanded Message Preview */}
      {expanded && (
        <div
          style={{
            borderTop: '1px solid rgba(201,169,110,0.15)',
            background: '#F7F4ED',
            padding: '12px 16px',
          }}
        >
          <div style={{ fontSize: '0.68rem', fontWeight: 600, color: '#7A6F60', marginBottom: 6 }}>
            PREVIEW PESAN WHATSAPP:
          </div>
          <pre
            style={{
              fontFamily: 'inherit',
              fontSize: '0.75rem',
              color: '#33302B',
              lineHeight: 1.6,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              margin: 0,
              maxHeight: 180,
              overflowY: 'auto',
              background: 'rgba(255,255,255,0.7)',
              padding: '10px 12px',
              borderRadius: 8,
              border: '1px solid rgba(201,169,110,0.2)',
            }}
          >
            {message}
          </pre>
        </div>
      )}
    </div>
  )
}

// ── Main Dashboard ─────────────────────────────────────────────────────────
function GuestDashboard() {
  const [query, setQuery] = useState('')
  const [activeSource, setActiveSource] = useState('Semua')

  const sources = ['Semua', ...Object.keys(SOURCE_COLORS)]

  const filtered = useMemo(() => {
    return GUEST_DATA.filter((g) => {
      const matchSource = activeSource === 'Semua' || g.source === activeSource
      const matchQuery = g.name.toLowerCase().includes(query.toLowerCase())
      return matchSource && matchQuery
    })
  }, [query, activeSource])

  const counts = useMemo(() => {
    const c = { Semua: GUEST_DATA.length }
    Object.keys(SOURCE_COLORS).forEach((src) => {
      c[src] = GUEST_DATA.filter((g) => g.source === src).length
    })
    return c
  }, [])

  return (
    <div
      className="paper-texture min-h-screen"
      style={{ background: 'linear-gradient(160deg, #F7F4ED 0%, #EEE9DE 100%)' }}
    >

      {/* ── Header ── */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(26,33,48,0.96) 0%, rgba(15,20,32,0.98) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '24px 16px 18px',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          borderBottom: '1px solid rgba(201,169,110,0.25)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          {/* Title & Subtitle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: 'rgba(201,169,110,0.15)',
                border: '1px solid rgba(201,169,110,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                flexShrink: 0,
              }}
            >
              💍
            </div>
            <div>
              <h1
                className="font-display"
                style={{
                  fontSize: '1.25rem',
                  color: '#E8C99A',
                  letterSpacing: '0.02em',
                  margin: 0,
                  lineHeight: 1.2,
                }}
              >
                WA Blast — Prita &amp; Ilham
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'rgba(232,201,154,0.65)', marginTop: 3, margin: 0 }}>
                Sabtu, 5 September 2026 · Auditorium BKKBN Halim
              </p>
            </div>
          </div>

          {/* Filter chips horizontal scrollable */}
          <div
            style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              paddingBottom: 4,
              marginBottom: 14,
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {sources.map((src) => {
              const isActive = activeSource === src
              return (
                <button
                  key={src}
                  id={`filter-${src.replace(/\s/g, '-')}`}
                  onClick={() => setActiveSource(src)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease',
                    border: isActive
                      ? '1px solid rgba(201,169,110,0.8)'
                      : '1px solid rgba(201,169,110,0.2)',
                    background: isActive
                      ? 'linear-gradient(135deg, rgba(201,169,110,0.3) 0%, rgba(184,148,79,0.2) 100%)'
                      : 'rgba(201,169,110,0.06)',
                    color: isActive ? '#E8C99A' : 'rgba(232,201,154,0.6)',
                    boxShadow: isActive ? '0 2px 10px rgba(201,169,110,0.2)' : 'none',
                    flexShrink: 0,
                  }}
                >
                  {src} · {counts[src]}
                </button>
              )
            })}
          </div>

          {/* Search Box with clear button */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: 14,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '0.85rem',
                pointerEvents: 'none',
                opacity: 0.7,
              }}
            >
              🔍
            </span>
            <input
              id="gl-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Cari nama tamu... (${filtered.length} tamu)`}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: 12,
                padding: '10px 36px 10px 38px',
                color: '#E8E4D9',
                fontSize: '0.85rem',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.65)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(201,169,110,0.25)')}
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                style={{
                  position: 'absolute',
                  right: 12,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'rgba(232,201,154,0.6)',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  padding: 4,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Guest List ── */}
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '20px 16px 100px' }}>

        {filtered.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14, padding: '0 4px' }}>
            <span style={{ fontSize: '0.75rem', color: '#7A6F60', fontWeight: 500 }}>
              Menampilkan {filtered.length} tamu
            </span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#9E9E9E' }}>
            <p style={{ fontSize: '2.5rem', marginBottom: 8 }}>🔍</p>
            <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>Tidak ada tamu ditemukan</p>
            <p style={{ fontSize: '0.78rem', color: '#B8944F', marginTop: 4 }}>
              Coba kata kunci pencarian lain atau ganti kategori filter
            </p>
          </div>
        ) : (
          filtered.map((guest, i) => {
            const key = `${guest.name}::${guest.source}`
            return (
              <GuestCard
                key={key}
                guest={guest}
                index={i}
              />
            )
          })
        )}
      </div>


      {/* ── Footer ── */}
      <div
        style={{
          textAlign: 'center',
          padding: '20px 16px 40px',
          fontSize: '0.75rem',
          color: '#7A6F60',
          borderTop: '1px solid rgba(201,169,110,0.15)',
        }}
      >
        {GUEST_DATA.length} tamu terdaftar · Prita &amp; Ilham 2026
      </div>
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
