/**
 * generate-wa-blast.mjs
 *
 * Reads all guest lists from list-undangan/ and generates:
 *   1. wa-blast.csv   — nama, URL undangan, kolom nomor HP, wa.me link, pesan WA
 *   2. wa-blast.html  — halaman HTML dengan tombol klik per tamu
 *
 * Usage: node scripts/generate-wa-blast.mjs
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')

// ── CONFIG ────────────────────────────────────────────────────────────────────
const BASE_URL = 'https://adventureof-pritailham.co'
const LIST_DIR = join(ROOT, 'list-undangan')
// ─────────────────────────────────────────────────────────────────────────────

/** Converts a guest name to a URL-friendly slug */
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

/** Build the personalized WhatsApp message for a guest */
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

// ── Read all guest list files ──────────────────────────────────────────────
const files = readdirSync(LIST_DIR).filter(f => f.endsWith('.txt'))
console.log(`📂  Found ${files.length} guest list file(s): ${files.join(', ')}`)

const allGuests = []

for (const file of files) {
  const filePath = join(LIST_DIR, file)
  const content = readFileSync(filePath, 'utf-8')
  const names = content
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0)

  const source = file.replace('.txt', '')
  for (const name of names) {
    allGuests.push({ name, source })
  }
}

console.log(`👥  Total guests: ${allGuests.length}`)

// ── Build guest data ───────────────────────────────────────────────────────
const guests = allGuests.map(({ name, source }, index) => {
  const slug = toSlug(name)
  const url = `${BASE_URL}/?to=${slug}`
  const message = buildMessage(name, url)
  const encodedMessage = encodeURIComponent(message)
  const waLink = `https://wa.me/?text=${encodedMessage}` // no phone → opens WA to pick contact

  return {
    no: index + 1,
    name,
    source,
    slug,
    url,
    message,
    waLink,
  }
})

// ── 1. CSV output ──────────────────────────────────────────────────────────
const csvHeader = 'No;Nama Tamu;Sumber List;Nomor HP (isi manual);URL Undangan;WA Link (klik untuk kirim)'
const csvRows = guests.map(g =>
  [
    g.no,
    `"${g.name}"`,
    `"${g.source}"`,
    '', // nomor HP — diisi manual
    g.url,
    g.waLink,
  ].join(';')
)
const csvContent = [csvHeader, ...csvRows].join('\n')
const csvPath = join(ROOT, 'wa-blast.csv')
writeFileSync(csvPath, '\uFEFF' + csvContent, 'utf-8')
console.log(`\n✅  CSV generated → ${csvPath}`)

// ── 2. HTML launcher page ─────────────────────────────────────────────────
const guestCards = guests
  .map(g => {
    const msgEscaped = g.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    return `
    <div class="card" id="guest-${g.no}">
      <div class="card-header">
        <span class="no">#${g.no}</span>
        <div class="name-info">
          <span class="name">${g.name.replace(/&/g, '&amp;')}</span>
          <span class="source">${g.source}</span>
        </div>
        <div class="actions">
          <a href="${g.waLink}" target="_blank" class="btn btn-wa" title="Kirim via WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.854L.073 23.927l6.263-1.643A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.007-1.368l-.36-.214-3.717.975.992-3.617-.235-.372A9.818 9.818 0 0112 2.182c5.42 0 9.818 4.398 9.818 9.818 0 5.421-4.398 9.818-9.818 9.818z"/></svg>
            Kirim WA
          </a>
          <button class="btn btn-copy" onclick="copyMsg(${g.no})" title="Copy pesan">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            Copy
          </button>
        </div>
      </div>
      <div class="url-row">
        <span class="url-label">🔗</span>
        <a href="${g.url}" target="_blank" class="url">${g.url}</a>
      </div>
      <textarea class="msg-preview" id="msg-${g.no}" readonly>${msgEscaped}</textarea>
    </div>`
  })
  .join('\n')

const html = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>WA Blast — Prita & Ilham 💍</title>
  <style>
    :root {
      --bg: #0d0d14;
      --surface: #16161f;
      --card: #1c1c28;
      --border: #2a2a3d;
      --accent: #c9a96e;
      --accent2: #e8c99a;
      --wa: #25d366;
      --text: #e8e4d9;
      --muted: #7a7a99;
      --radius: 14px;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Segoe UI', system-ui, sans-serif;
      background: var(--bg);
      color: var(--text);
      min-height: 100vh;
    }
    header {
      background: linear-gradient(135deg, #1a1028 0%, #0d1a2e 100%);
      border-bottom: 1px solid var(--border);
      padding: 28px 24px 22px;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 100;
      backdrop-filter: blur(12px);
    }
    header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--accent2);
      letter-spacing: .5px;
    }
    header p { color: var(--muted); font-size: .875rem; margin-top: 4px; }
    .stats {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-top: 14px;
      flex-wrap: wrap;
    }
    .stat {
      background: rgba(201,169,110,.1);
      border: 1px solid rgba(201,169,110,.25);
      border-radius: 20px;
      padding: 4px 16px;
      font-size: .8rem;
      color: var(--accent);
    }
    .search-bar {
      max-width: 900px;
      margin: 20px auto 0;
      padding: 0 20px;
    }
    .search-bar input {
      width: 100%;
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 10px;
      padding: 10px 16px;
      color: var(--text);
      font-size: .9rem;
      outline: none;
      transition: border-color .2s;
    }
    .search-bar input:focus { border-color: var(--accent); }
    .search-bar input::placeholder { color: var(--muted); }
    main { max-width: 900px; margin: 0 auto; padding: 20px; }
    .card {
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      margin-bottom: 12px;
      overflow: hidden;
      transition: border-color .2s, transform .15s;
    }
    .card:hover { border-color: rgba(201,169,110,.4); transform: translateY(-1px); }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 14px 16px;
      flex-wrap: wrap;
    }
    .no {
      font-size: .75rem;
      color: var(--muted);
      min-width: 32px;
    }
    .name-info { flex: 1; min-width: 0; }
    .name {
      display: block;
      font-weight: 600;
      font-size: .95rem;
      color: var(--text);
    }
    .source {
      font-size: .72rem;
      color: var(--muted);
    }
    .actions { display: flex; gap: 8px; flex-shrink: 0; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 7px 14px;
      border-radius: 8px;
      font-size: .8rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      border: none;
      transition: opacity .2s, transform .1s;
    }
    .btn:active { transform: scale(.96); }
    .btn svg { width: 15px; height: 15px; }
    .btn-wa {
      background: var(--wa);
      color: #fff;
    }
    .btn-wa:hover { opacity: .88; }
    .btn-copy {
      background: rgba(201,169,110,.15);
      color: var(--accent);
      border: 1px solid rgba(201,169,110,.3);
    }
    .btn-copy:hover { background: rgba(201,169,110,.25); }
    .btn-copy.copied { background: rgba(100,200,100,.15); color: #6dc87a; border-color: rgba(100,200,100,.3); }
    .url-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px 10px;
      background: rgba(0,0,0,.15);
    }
    .url-label { font-size: .8rem; }
    .url { font-size: .78rem; color: #7eb8f7; word-break: break-all; }
    .msg-preview {
      display: none;
      width: 100%;
      background: rgba(0,0,0,.2);
      border: none;
      border-top: 1px solid var(--border);
      padding: 12px 16px;
      color: var(--muted);
      font-size: .78rem;
      font-family: 'Courier New', monospace;
      line-height: 1.5;
      resize: vertical;
      height: 180px;
    }
    .msg-preview.show { display: block; }
    footer {
      text-align: center;
      padding: 32px;
      color: var(--muted);
      font-size: .8rem;
    }
    .toast {
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #25d366;
      color: #fff;
      padding: 10px 20px;
      border-radius: 10px;
      font-weight: 600;
      opacity: 0;
      transform: translateY(8px);
      transition: all .3s;
      pointer-events: none;
      z-index: 9999;
    }
    .toast.show { opacity: 1; transform: translateY(0); }
  </style>
</head>
<body>

<header>
  <h1>💍 WA Blast — Prita & Ilham</h1>
  <p>Sabtu, 5 September 2026 · Auditorium BKKBN Halim</p>
  <div class="stats">
    ${
      [...new Set(guests.map(g => g.source))].map(src => {
        const count = guests.filter(g => g.source === src).length
        return `<span class="stat">${src}: ${count} tamu</span>`
      }).join('\n    ')
    }
    <span class="stat">Total: ${guests.length} tamu</span>
  </div>
</header>

<div class="search-bar">
  <input type="text" id="search" placeholder="🔍 Cari nama tamu..." oninput="filterGuests()">
</div>

<main id="guest-list">
${guestCards}
</main>

<footer>Generated on ${new Date().toLocaleString('id-ID')} · Prita & Ilham 2026</footer>

<div class="toast" id="toast">✅ Pesan disalin!</div>

<script>
const messages = ${JSON.stringify(Object.fromEntries(guests.map(g => [g.no, g.message])))};

function copyMsg(no) {
  const msg = messages[no]
  navigator.clipboard.writeText(msg).then(() => {
    const btn = document.querySelector('#guest-' + no + ' .btn-copy')
    btn.textContent = '✓ Disalin'
    btn.classList.add('copied')
    setTimeout(() => {
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy'
      btn.classList.remove('copied')
    }, 2000)
    showToast()
  })
}

function showToast() {
  const t = document.getElementById('toast')
  t.classList.add('show')
  setTimeout(() => t.classList.remove('show'), 2200)
}

function filterGuests() {
  const q = document.getElementById('search').value.toLowerCase()
  document.querySelectorAll('.card').forEach(card => {
    const name = card.querySelector('.name').textContent.toLowerCase()
    const src = card.querySelector('.source').textContent.toLowerCase()
    card.style.display = (name.includes(q) || src.includes(q)) ? '' : 'none'
  })
}
</script>
</body>
</html>`

const htmlPath = join(ROOT, 'wa-blast.html')
writeFileSync(htmlPath, html, 'utf-8')
console.log(`✅  HTML launcher generated → ${htmlPath}`)
console.log(`\n📋  Summary:`)
console.log(`    Total guests   : ${guests.length}`)
guests.reduce((acc, g) => {
  acc[g.source] = (acc[g.source] || 0) + 1
  return acc
}, {})
const sourceCount = {}
guests.forEach(g => sourceCount[g.source] = (sourceCount[g.source] || 0) + 1)
Object.entries(sourceCount).forEach(([src, count]) => {
  console.log(`    ${src.padEnd(35)}: ${count} tamu`)
})
console.log(`\n🚀  Buka wa-blast.html di browser untuk mulai blast!`)
