import { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import toast from 'react-hot-toast'

// ── CONFIG ─────────────────────────────────────────────────────────────────
const BASE_URL = 'https://adventureof-pritailham.co'
const SESSION_KEY = 'guestlist_authed'

// ── GUEST DATA ─────────────────────────────────────────────────────────────
const GUEST_DATA = [
  // List Undangan Prita
  { name: 'Dimas Pandu', source: 'Prita' },
  { name: 'Salini Rengganis', source: 'Prita' },
  { name: 'Satya Winnie', source: 'Prita' },
  { name: 'David John Schaap', source: 'Prita' },
  { name: 'Intan Audia & Partner', source: 'Prita' },
  { name: 'Damaresty Andyani & Partner', source: 'Prita' },
  { name: 'Fauzan Al Habibie', source: 'Prita' },
  { name: 'Guruh Wiratama', source: 'Prita' },
  { name: 'Bimo Hendarto', source: 'Prita' },
  { name: 'Achmad Fajar Rydwan & Partner', source: 'Prita' },
  { name: 'Teh Evi & Partner', source: 'Prita' },
  { name: 'Alzeina Nysa & Partner', source: 'Prita' },
  { name: 'Bariq Rizki', source: 'Prita' },
  { name: 'M Farid Imansyah & Partner', source: 'Prita' },
  { name: 'Lenny Kurniawan', source: 'Prita' },
  { name: 'Firyal Raudya Yasmin & Partner', source: 'Prita' },
  { name: 'Dinda Aurelia & Partner', source: 'Prita' },
  { name: 'Nadya Rheinata & Partner', source: 'Prita' },
  { name: 'Nailah Rahmah', source: 'Prita' },
  { name: 'Nurnahdiyah', source: 'Prita' },
  { name: 'Nada Djulaeny', source: 'Prita' },
  { name: 'Kak Dyhar & Partner', source: 'Prita' },
  { name: 'Dimas Proklamahari & Partner', source: 'Prita' },
  { name: 'Indriyani', source: 'Prita' },
  { name: 'Chrysant Jacob & Partner', source: 'Prita' },
  { name: 'Anggun Valentania', source: 'Prita' },
  { name: 'Ira Puspita', source: 'Prita' },
  { name: 'Nadira Muharam', source: 'Prita' },
  { name: 'Annisa Azzara', source: 'Prita' },
  { name: 'Risalatul H Anasha', source: 'Prita' },
  { name: 'Riska', source: 'Prita' },
  { name: 'Deisy Kristianty Handayani', source: 'Prita' },
  { name: 'Indah Permatasari & Partner', source: 'Prita' },
  { name: 'Stephanus Bayu & Partner', source: 'Prita' },
  { name: 'Ismail Saleh & Partner', source: 'Prita' },
  { name: 'Ibu Healthy Nirmalasari & Partner', source: 'Prita' },
  { name: 'Bpk. Herwan Abdul Muhyi & Partner', source: 'Prita' },
  { name: 'Ibu Dian Fitriyani & Partner', source: 'Prita' },
  { name: 'Nindya Vinya Lorenz & Partner', source: 'Prita' },
  { name: 'Alya Dalila & Partner', source: 'Prita' },
  { name: 'Ditri Indah', source: 'Prita' },
  { name: 'Rheny Trie Oktania & Partner', source: 'Prita' },
  { name: 'Charvia Ismi Zahrani & Partner', source: 'Prita' },
  { name: 'Puti Nur Illahirahma', source: 'Prita' },
  { name: 'Rizka Elfira & Partner', source: 'Prita' },
  { name: 'Vrescafelthya Trimantari', source: 'Prita' },
  { name: 'Vina Ramadhani', source: 'Prita' },
  { name: 'Tara Hanifa', source: 'Prita' },
  { name: 'Indah Permatasari', source: 'Prita' },
  { name: 'Ajiziah Qotrunada', source: 'Prita' },
  { name: 'Om Anto & Tante Neil', source: 'Prita' },
  { name: 'Nadia Nunlehu & Family', source: 'Prita' },
  { name: 'Salsabila Sukayana Puteri', source: 'Prita' },
  { name: 'Maghfira Addini & Partner', source: 'Prita' },
  { name: 'Gita Ramadhani & Partner', source: 'Prita' },
  { name: 'Lailizzah Hani', source: 'Prita' },
  { name: 'Farah Yumna & Partner', source: 'Prita' },
  { name: 'Dindi Claudia', source: 'Prita' },
  { name: 'Nurrahmi Wibawani', source: 'Prita' },
  { name: 'Janna Alila Timur & Partner', source: 'Prita' },
  { name: 'Alief Firmansyah & Partner', source: 'Prita' },
  { name: 'Ainiyah Mutia & Partner', source: 'Prita' },
  { name: 'Alam Pandji & Partner', source: 'Prita' },
  { name: 'Alvin Fajri & Partner', source: 'Prita' },
  { name: 'Annisa Fitriani & Partner', source: 'Prita' },
  { name: 'R. Bagas Priyotomo & Partner', source: 'Prita' },
  { name: 'Febe Eunike & Partner', source: 'Prita' },
  { name: 'Hanni Gustyasari', source: 'Prita' },
  { name: 'Ikhsantiko Aswianto', source: 'Prita' },
  { name: 'Kasamira Amadea & Partner', source: 'Prita' },
  { name: 'Merry Puspitasari & Partner', source: 'Prita' },
  { name: 'Raihan Al Muzzamil', source: 'Prita' },
  { name: 'Raka Ryan & Partner', source: 'Prita' },
  { name: 'Rizvan Deary & Partner', source: 'Prita' },
  { name: 'Saffanati Rahmah', source: 'Prita' },
  { name: 'Sultan Rafif & Partner', source: 'Prita' },
  { name: 'Suharsa Ary', source: 'Prita' },
  { name: 'Rifky Pratama & Partner', source: 'Prita' },
  { name: 'Amelia Rahmatillah & Partner', source: 'Prita' },
  { name: 'Nabil Fadhillah & Partner', source: 'Prita' },
  { name: 'Syafira Rahma & Partner', source: 'Prita' },
  { name: 'Pakde Anton & Bude Sofi', source: 'Prita' },
  { name: 'Wyanet Putri', source: 'Prita' },
  { name: 'Erica Annisa', source: 'Prita' },
  { name: 'Vini Velolita', source: 'Prita' },
  { name: 'Evan Aldiano & Partner', source: 'Prita' },
  { name: 'Eunike Callista & Andrew', source: 'Prita' },
  { name: 'Juvensius', source: 'Prita' },
  { name: 'Wandy Fernanda', source: 'Prita' },
  { name: 'Mohammad Akmal', source: 'Prita' },
  { name: 'Tante Een & Om Dimas', source: 'Prita' },
  { name: 'Kak Bunga & Kak Mega', source: 'Prita' },
  { name: 'Om Ritman & Tante Eny Ratnawati', source: 'Prita' },
  { name: 'Om Rudy Zamrudin & Tante Dian Kurniati', source: 'Prita' },
  { name: 'Om Sudjud Siradjuddin & Tante Syawliyanti', source: 'Prita' },
  { name: 'Om Ben Helmi & Tante Susilastri', source: 'Prita' },
  { name: 'Om Uus Rukmantara & Tante Linda Ayu T', source: 'Prita' },
  { name: 'Om Sapril & Tante Tintin Yunarsih', source: 'Prita' },
  { name: 'Om Indrawan & Tante Trinyati', source: 'Prita' },
  { name: 'Tante Nurhayati', source: 'Prita' },
  { name: 'Om Jamalulael & Tante Azizah', source: 'Prita' },
  // List Undangan Lagapaners
  { name: 'Bpk. Baskoro', source: 'Lagapaners' },
  { name: 'Ibu Retno Sri Utami', source: 'Lagapaners' },
  { name: 'Ibu Vera Ina Susanti', source: 'Lagapaners' },
  { name: 'Bpk. Wisnu Cahyo', source: 'Lagapaners' },
  { name: 'Bpk. A. Haryono', source: 'Lagapaners' },
  { name: 'Ibu Sri Andrini', source: 'Lagapaners' },
  { name: 'Bpk. Bima Sakti', source: 'Lagapaners' },
  { name: 'Bpk. Deni F. Azil', source: 'Lagapaners' },
  { name: 'Ibu Dewi S. Karya', source: 'Lagapaners' },
  { name: 'Bpk. Erie Prakoso', source: 'Lagapaners' },
  { name: 'Ibu Dr. Kristiantini Dewi', source: 'Lagapaners' },
  { name: 'Bpk. Moenardi', source: 'Lagapaners' },
  { name: 'Ibu Myra Esfandiary', source: 'Lagapaners' },
  { name: 'Bpk. Pranoto Setiawan', source: 'Lagapaners' },
  { name: 'Ibu R. Isfandiari', source: 'Lagapaners' },
  { name: 'Bpk. Renaldy Dewantoro', source: 'Lagapaners' },
  { name: 'Bpk. Djonny M.S', source: 'Lagapaners' },
  { name: 'Bpk. Dony M. Oekon', source: 'Lagapaners' },
  { name: 'Ibu Elena Ardini', source: 'Lagapaners' },
  { name: 'Bpk. Ervan Octaviano', source: 'Lagapaners' },
  { name: 'Bpk. Ferry Samosir', source: 'Lagapaners' },
  { name: 'Ibu Irma', source: 'Lagapaners' },
  { name: 'Bpk. RM Ponang', source: 'Lagapaners' },
  { name: 'Bpk.Teuku Syahputra', source: 'Lagapaners' },
  { name: 'Ibu Willis Henny Prastuti', source: 'Lagapaners' },
  { name: 'Bpk. Subur Yuli Winarso', source: 'Lagapaners' },
  { name: 'Ibu Devi Andrini', source: 'Lagapaners' },
  { name: 'Ibu Tri Wahyuwidayati', source: 'Lagapaners' },
  { name: 'Bpk. Wisnu Hidayat', source: 'Lagapaners' },
  { name: 'Bpk. Ade Suryadi', source: 'Lagapaners' },
  { name: 'Bpk. Pudji Hartono', source: 'Lagapaners' },
  { name: 'Ibu Nurlita Sukma', source: 'Lagapaners' },
  { name: 'Bpk. Nanto Panjaitan', source: 'Lagapaners' },
  // List Undangan Tante Dian
  { name: 'Keluarga Bpk. Ir. Moelyadi', source: 'Tante Dian' },
  { name: 'Keluarga Bpk. Dr. Koesmadi', source: 'Tante Dian' },
  { name: 'Keluarga Bpk. Ir. Wahyudi', source: 'Tante Dian' },
  { name: 'Keluarga Bpk. Arzil Pamuntjak', source: 'Tante Dian' },
  { name: 'Keluarga Bpk. Kardjani Chamid', source: 'Tante Dian' },
  { name: 'Bpk. Nur Hakim Arif & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Aat Adibirawan & Istri', source: 'Tante Dian' },
  { name: 'Keluarga (Alm) Bpk. Eddy Suwignyo', source: 'Tante Dian' },
  { name: 'Keluarga (Alm) Bpk. Atang Ruwinda', source: 'Tante Dian' },
  { name: 'Bpk. Saleh Effendi & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Tedi Kurniadi & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Adjie Rustam Ramdja & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Agus Soerarso & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Wawan Kadarusman & Istri', source: 'Tante Dian' },
  { name: 'Ibu Pengky & Ibu Tutie', source: 'Tante Dian' },
  { name: 'Bpk. Achmad Setiadi & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Ilham Setiabudi & Istri', source: 'Tante Dian' },
  { name: 'Keluarga (Alm) Bpk. Endang Waskita', source: 'Tante Dian' },
  { name: 'Ibu Yeni', source: 'Tante Dian' },
  { name: 'Ibu Kinah', source: 'Tante Dian' },
  { name: 'Bpk. Agus Hartono & Istri', source: 'Tante Dian' },
  { name: 'Ibu Tutun Jumiati & Suami', source: 'Tante Dian' },
  { name: 'Bpk. Yusuf Permana & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Ichlas & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Amirul Yusuf & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Ivan Ekancono & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Endang Kosasih & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Fajri & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Anas Luthfi & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Yasir Arafat', source: 'Tante Dian' },
  { name: 'Mazaya & Partner', source: 'Tante Dian' },
  { name: 'Bpk. Fauzi Buldan Y & Istri', source: 'Tante Dian' },
  { name: 'Ibu Christine', source: 'Tante Dian' },
  { name: 'Bpk. Ariastiadi Saleh H & Istri', source: 'Tante Dian' },
  { name: 'Bpk. Hari Supada & Istri', source: 'Tante Dian' },
  { name: 'Ibu Endah Yuliastini & Suami', source: 'Tante Dian' },
  { name: 'Diana & Suami', source: 'Tante Dian' },
  { name: 'Bpk. Ansari Siman & Istri', source: 'Tante Dian' },
  { name: 'Ibu Nurhayati', source: 'Tante Dian' },
  { name: 'Ibu Novi Hediyani & Suami', source: 'Tante Dian' },
  { name: 'Alun Riawati & Suami', source: 'Tante Dian' },
  { name: 'Winne & Suami', source: 'Tante Dian' },
  { name: 'Mona Delviana & Suami', source: 'Tante Dian' },
  { name: 'Doni Novari & Suami', source: 'Tante Dian' },
  { name: 'Wiwiek Darmansyah & Suami', source: 'Tante Dian' },
  { name: 'Mieke Retno & Suami', source: 'Tante Dian' },
  { name: 'Seradesy & Suami', source: 'Tante Dian' },
  { name: 'Dian Purwandari & Suami', source: 'Tante Dian' },
  { name: 'Yurida & Suami', source: 'Tante Dian' },
  { name: 'Berry Waworuntu & Suami', source: 'Tante Dian' },
]

const SOURCE_COLORS = {
  Prita: { bg: 'rgba(201,169,110,0.12)', border: 'rgba(201,169,110,0.35)', text: '#B8944F' },
  Lagapaners: { bg: 'rgba(46,58,79,0.12)', border: 'rgba(46,58,79,0.35)', text: '#4A5F7A' },
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

function buildWaLink(name, url) {
  return `https://wa.me/?text=${encodeURIComponent(buildMessage(name, url))}`
}

// ── Bulk Queue Panel ───────────────────────────────────────────────────────
function BulkQueuePanel({ queue, onClose }) {
  const [idx, setIdx] = useState(0)
  const [statuses, setStatuses] = useState(() => Object.fromEntries(queue.map((_, i) => [i, 'pending'])))
  const opened = useRef(false)

  const current = queue[idx]
  const total = queue.length
  const sentCount = Object.values(statuses).filter(s => s === 'sent').length
  const skippedCount = Object.values(statuses).filter(s => s === 'skipped').length
  const isDone = idx >= total

  const currentUrl = current ? `${BASE_URL}/?to=${toSlug(current.name)}` : ''
  const currentWaLink = current ? buildWaLink(current.name, currentUrl) : ''

  useEffect(() => {
    if (!current || opened.current) return
    opened.current = true
    window.open(currentWaLink, '_blank', 'noopener,noreferrer')
  }, [current, currentWaLink])

  function advance(status) {
    setStatuses(prev => ({ ...prev, [idx]: status }))
    opened.current = false
    setIdx(i => i + 1)
  }

  function handleSent() { advance('sent') }
  function handleSkip() { advance('skipped') }

  function openCurrent() {
    window.open(currentWaLink, '_blank', 'noopener,noreferrer')
  }

  const progress = total > 0 ? (idx / total) * 100 : 0
  const srcColor = current ? (SOURCE_COLORS[current.source] || SOURCE_COLORS['Prita']) : SOURCE_COLORS['Prita']

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 200,
      background: 'rgba(10,15,28,0.8)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
    }}>
      <div style={{
        background: 'linear-gradient(160deg, #1E283C 0%, #0F1420 100%)',
        border: '1px solid rgba(201,169,110,0.3)',
        borderRadius: 24,
        width: '100%', maxWidth: 460,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(201,169,110,0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 className="font-display" style={{ fontSize: '1.15rem', color: '#E8C99A', margin: 0 }}>
              {isDone ? '🎉 Selesai!' : '📤 Bulk Send WA'}
            </h2>
            <p style={{ fontSize: '0.75rem', color: 'rgba(232,201,154,0.6)', marginTop: 2, margin: 0 }}>
              {isDone
                ? `${sentCount} terkirim · ${skippedCount} dilewati`
                : `${idx + 1} dari ${total} tamu`}
            </p>
          </div>
          <button onClick={onClose} style={{
            width: 34, height: 34, borderRadius: 10,
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'rgba(232,228,217,0.7)', cursor: 'pointer', fontSize: '1.1rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>✕</button>
        </div>

        {/* Progress bar */}
        <div style={{ height: 4, background: 'rgba(255,255,255,0.08)' }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #C9A96E, #E8C99A)',
            transition: 'width 0.4s ease',
            borderRadius: '0 2px 2px 0',
          }} />
        </div>

        <div style={{ padding: '24px' }}>
          {isDone ? (
            /* ── Done state ── */
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>🎊</div>
              <h3 style={{ color: '#E8C99A', fontSize: '1.2rem', marginBottom: 16 }}>
                Proses Blast Selesai!
              </h3>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 24
              }}>
                {[
                  ['Dikirim', sentCount, '#25D366'],
                  ['Dilewati', skippedCount, '#C9A96E'],
                  ['Total', total, '#4A5F7A']
                ].map(([label, val, color]) => (
                  <div key={label} style={{
                    background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 14, padding: '14px 8px', textAlign: 'center',
                  }}>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color }}>{val}</div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(232,228,217,0.6)', marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <button onClick={onClose} style={{
                width: '100%', padding: '12px',
                background: 'linear-gradient(135deg, #C9A96E 0%, #B8944F 100%)',
                border: 'none', borderRadius: 12,
                color: '#fff', fontWeight: 700, fontSize: '0.85rem',
                cursor: 'pointer', letterSpacing: '0.04em',
              }}>Tutup</button>
            </div>
          ) : (
            /* ── Active state ── */
            <>
              {/* Guest card */}
              <div style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,169,110,0.25)',
                borderRadius: 18, padding: '18px',
                marginBottom: 20,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(201,169,110,0.15)',
                    border: '1px solid rgba(201,169,110,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.2rem', flexShrink: 0,
                  }}>👤</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: '1.05rem', fontWeight: 700, color: '#E8E4D9',
                      marginBottom: 4, wordBreak: 'break-word',
                    }}>{current.name}</div>
                    <span style={{
                      fontSize: '0.68rem', padding: '2px 10px', borderRadius: 20,
                      background: srcColor.bg, border: `1px solid ${srcColor.border}`,
                      color: srcColor.text, fontWeight: 600, whiteSpace: 'nowrap',
                    }}>{current.source}</span>
                  </div>
                </div>

                <div style={{
                  marginTop: 14, padding: '8px 12px',
                  background: 'rgba(0,0,0,0.25)', borderRadius: 10,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>🔗</span>
                  <span style={{ fontSize: '0.72rem', color: '#4A5F7A', wordBreak: 'break-all' }}>{currentUrl}</span>
                </div>
              </div>

              {/* Instruction Hint */}
              <p style={{
                fontSize: '0.78rem', color: 'rgba(232,228,217,0.55)',
                textAlign: 'center', marginBottom: 16, lineHeight: 1.5,
              }}>
                Tab WhatsApp telah terbuka.<br />
                Klik <strong style={{ color: '#E8C99A' }}>Terkirim ✓</strong> jika pesan sudah dikirim.
              </p>

              {/* Re-open button */}
              <button onClick={openCurrent} style={{
                width: '100%', padding: '11px',
                background: 'rgba(37,211,102,0.12)',
                border: '1px solid rgba(37,211,102,0.35)',
                borderRadius: 12, color: '#25D366',
                fontSize: '0.82rem', fontWeight: 600,
                cursor: 'pointer', marginBottom: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z"/>
                </svg>
                Buka Tab WA Lagi
              </button>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={handleSkip} style={{
                  flex: 1, padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 12, color: 'rgba(232,228,217,0.6)',
                  fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer',
                }}>Lewati →</button>
                <button onClick={handleSent} style={{
                  flex: 2, padding: '12px',
                  background: 'linear-gradient(135deg, #C9A96E 0%, #B8944F 100%)',
                  border: 'none', borderRadius: 12,
                  color: '#fff', fontSize: '0.85rem', fontWeight: 700,
                  cursor: 'pointer', letterSpacing: '0.03em',
                  boxShadow: '0 4px 12px rgba(201,169,110,0.3)',
                }}>Terkirim ✓</button>
              </div>

              {/* Queue preview dots */}
              {total <= 30 && (
                <div style={{
                  display: 'flex', gap: 4, justifyContent: 'center',
                  marginTop: 20, flexWrap: 'wrap',
                }}>
                  {queue.map((_, i) => (
                    <div key={i} style={{
                      width: statuses[i] === 'pending' && i === idx ? 16 : 8,
                      height: 8, borderRadius: 4,
                      background:
                        statuses[i] === 'sent' ? '#25D366' :
                        statuses[i] === 'skipped' ? 'rgba(201,169,110,0.4)' :
                        i === idx ? '#C9A96E' :
                        'rgba(255,255,255,0.12)',
                      transition: 'all 0.3s ease',
                    }} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
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
function GuestCard({ guest, index, selected, onToggleSelect, selectMode }) {
  const [copied, setCopied] = useState(false)
  const [expanded, setExpanded] = useState(false)

  const slug = toSlug(guest.name)
  const url = `${BASE_URL}/?to=${slug}`
  const message = buildMessage(guest.name, url)
  const waLink = buildWaLink(guest.name, url)
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
        background: selected ? 'rgba(201,169,110,0.08)' : 'rgba(255, 255, 255, 0.85)',
        border: selected ? '1.5px solid rgba(201,169,110,0.65)' : '1px solid rgba(201,169,110,0.22)',
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: selected
          ? '0 6px 20px rgba(201,169,110,0.15)'
          : '0 2px 10px rgba(46,58,79,0.04)',
      }}
    >
      {/* Top Header Row inside Card: Checkbox + Name + Source Tag */}
      <div
        style={{
          padding: '14px 16px 10px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
        }}
      >
        {/* Checkbox / Index indicator */}
        <div
          onClick={() => onToggleSelect && onToggleSelect()}
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            background: selected
              ? 'linear-gradient(135deg, #C9A96E 0%, #B8944F 100%)'
              : 'rgba(201,169,110,0.1)',
            border: selected
              ? 'none'
              : '1.5px solid rgba(201,169,110,0.35)',
            color: selected ? '#FFF' : '#7A6F60',
            fontWeight: 700,
            fontSize: '0.75rem',
            transition: 'all 0.2s ease',
            marginTop: 2,
          }}
        >
          {selected ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFF" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            `#${index + 1}`
          )}
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
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z"/>
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
  const [selected, setSelected] = useState(new Set())
  const [bulkQueue, setBulkQueue] = useState(null)
  const selectMode = selected.size > 0

  const toggleSelect = useCallback((guestKey) => {
    setSelected(prev => {
      const next = new Set(prev)
      if (next.has(guestKey)) next.delete(guestKey)
      else next.add(guestKey)
      return next
    })
  }, [])

  const selectAll = useCallback((list) => {
    setSelected(prev => {
      const next = new Set(prev)
      list.forEach(g => next.add(`${g.name}::${g.source}`))
      return next
    })
  }, [])

  const clearAll = useCallback(() => setSelected(new Set()), [])

  function startBulk() {
    const queue = GUEST_DATA.filter(g => selected.has(`${g.name}::${g.source}`))
    if (queue.length === 0) return
    setBulkQueue(queue)
  }

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
      {/* ── Bulk Queue Panel ── */}
      {bulkQueue && (
        <BulkQueuePanel
          queue={bulkQueue}
          onClose={() => { setBulkQueue(null); clearAll() }}
        />
      )}

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
        {/* Select-all row */}
        {filtered.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 14,
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <button
                onClick={() => selectAll(filtered)}
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: '#B8944F',
                  background: 'rgba(201,169,110,0.12)',
                  border: '1px solid rgba(201,169,110,0.25)',
                  borderRadius: 8,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  letterSpacing: '0.01em',
                  transition: 'all 0.15s ease',
                }}
              >
                Pilih Semua ({filtered.length})
              </button>

              {selectMode && (
                <button
                  onClick={clearAll}
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 500,
                    color: '#7A6F60',
                    background: 'transparent',
                    border: '1px solid rgba(122,111,96,0.2)',
                    borderRadius: 8,
                    cursor: 'pointer',
                    padding: '6px 12px',
                  }}
                >
                  Batalkan Pilihan
                </button>
              )}
            </div>

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
                selected={selected.has(key)}
                selectMode={selectMode}
                onToggleSelect={() => toggleSelect(key)}
              />
            )
          })
        )}
      </div>

      {/* ── Floating Bulk Action Bar ── */}
      {selectMode && !bulkQueue && (
        <div
          style={{
            position: 'fixed',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 24px)',
            maxWidth: 480,
            zIndex: 100,
            background: 'linear-gradient(135deg, rgba(22, 28, 44, 0.96) 0%, rgba(12, 16, 26, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(201,169,110,0.35)',
            borderRadius: 20,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            boxShadow: '0 16px 48px rgba(0,0,0,0.45), 0 0 24px rgba(201,169,110,0.15)',
            animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            boxSizing: 'border-box',
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { opacity: 0; transform: translateX(-50%) translateY(20px); }
              to   { opacity: 1; transform: translateX(-50%) translateY(0); }
            }
          `}</style>

          {/* Left count & info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <div
              style={{
                background: 'rgba(201,169,110,0.22)',
                border: '1px solid rgba(201,169,110,0.45)',
                borderRadius: 12,
                padding: '4px 10px',
                fontSize: '0.78rem',
                fontWeight: 700,
                color: '#E8C99A',
                whiteSpace: 'nowrap',
              }}
            >
              {selected.size} tamu
            </div>

            <button
              onClick={clearAll}
              title="Batalkan pilihan"
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(232,228,217,0.6)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {/* Right Bulk Blast CTA */}
          <button
            onClick={startBulk}
            style={{
              background: 'linear-gradient(135deg, #C9A96E 0%, #B8944F 100%)',
              border: 'none',
              borderRadius: 12,
              padding: '10px 16px',
              color: '#FFF',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0,
              letterSpacing: '0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 14px rgba(201,169,110,0.3)',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z"/>
            </svg>
            <span>Blast Sekarang</span>
          </button>
        </div>
      )}

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
