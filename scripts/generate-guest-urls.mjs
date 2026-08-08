/**
 * generate-guest-urls.mjs
 *
 * Generates a CSV file with personalized invite URLs for each guest.
 * Usage: node scripts/generate-guest-urls.mjs
 *
 * Output: guest-urls.csv  (in the project root)
 */

import { writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── CONFIG ────────────────────────────────────────────────────────────────────
// Change this to your actual deployed domain, e.g. https://prita-ilham.vercel.app
const BASE_URL = 'https://adventureof-pritailham.co'
// ─────────────────────────────────────────────────────────────────────────────

const guests = [
  'Dimas Pandu',
  'Salini Rengganis',
  'Satya Winnie',
  'David John Schaap',
  'Intan Audia & Partner',
  'Damaresty Andyani & Partner',
  'Fauzan Al Habibie',
  'Guruh Wiratama',
  'Bimo Hendarto',
  'Achmad Fajar Rydwan & Partner',
  'Teh Evi & Partner',
  'Alzeina Nysa & Partner',
  'Bariq Rizki',
  'M Farid Imansyah & Partner',
  'Lenny Kurniawan',
  'Firyal Raudya Yasmin & Partner',
  'Dinda Aurelia & Partner',
  'Nadya Rheinata & Partner',
  'Nailah Rahmah',
  'Nurnahdiyah',
  'Nada Djulaeny',
  'Kak Dyhar & Partner',
  'Dimas Proklamahari & Partner',
  'Indriyani',
  'Chrysant Jacob & Partner',
  'Anggun Valentania',
  'Ira Puspita',
  'Nadira Muharam',
  'Annisa Azzara',
  'Risalatul H Anasha',
  'Riska',
  'Deisy Kristianty Handayani',
  'Indah Permatasari & Partner',
  'Stephanus Bayu & Partner',
  'Ismail Saleh & Partner',
  'Ibu Healthy Nirmalasari & Partner',
  'Bpk. Herwan Abdul Muhyi & Partner',
  'Ibu Dian Fitriyani & Partner',
  'Nindya Vinya Lorenz & Partner',
  'Alya Dalila & Partner',
  'Ditri Indah',
  'Rheny Trie Oktania & Partner',
  'Charvia Ismi Zahrani & Partner',
  'Puti Nur Illahirahma',
  'Rizka Elfira & Partner',
  'Vrescafelthya Trimantari',
  'Vina Ramadhani',
  'Tara Hanifa',
  'Indah Permatasari',
  'Ajiziah Qotrunnada',
  'Om Anto & Tante Neil',
  'Nadia Nunlehu & Family',
  'Salsabila Sukayana Puteri',
  'Maghfira Addini & Partner',
  'Gita Ramadhani & Partner',
  'Lailizzah Hani',
  'Farah Yumna & Partner',
  'Dindi Claudia',
  'Nurrahmi Wibawani',
  'Janna Alila Timur & Partner',
  'Alief Firmansyah & Partner',
  'Ainiyah Mutia & Partner',
  'Alam Pandji & Partner',
  'Alvin Fajri & Partner',
  'Annisa Fitriani & Partner',
  'R. Bagas Priyotomo & Partner',
  'Febe Eunike & Partner',
  'Hanni Gustyasari',
  'Ikhsantiko Aswianto',
  'Kasamira Amadea & Partner',
  'Merry Puspitasari & Partner',
  'Raihan Al Muzzamil',
  'Raka Ryan & Partner',
  'Rizvan Deary & Partner',
  'Saffanati Rahmah',
  'Sultan Rafif & Partner',
  'Suharsa Ary',
  'Rifky Pratama & Partner',
  'Hafiyan Pragiwaksono & Partner',
  'Amelia Rahmatillah & Partner',
  'Nabil Fadhillah & Partner',
  'Syafira Rahma & Partner',
  'Pakde Anton & Bude Sofi',
  'Wyanet Putri',
  'Erica Annisa',
  'Vini Velolita',
  'Evan Aldiano & Partner',
  'Eunike Callista & Andrew',
  'Juvensius',
  'Wandy Fernanda',
  'Mohammad Akmal',
]

/**
 * Converts a guest name to a URL-friendly slug.
 * e.g. "Dimas Pandu" → "dimas-pandu"
 *      "Intan Audia & Partner" → "intan-audia-partner"
 */
function toSlug(name) {
  return name
    .toLowerCase()
    .replace(/&/g, '')        // remove ampersands
    .replace(/\./g, '')       // remove dots
    .replace(/[^a-z0-9\s-]/g, '') // remove other special chars
    .trim()
    .replace(/\s+/g, '-')    // spaces → hyphens
    .replace(/-+/g, '-')     // collapse multiple hyphens
}

// Build rows
const rows = guests.map((name) => {
  const slug = toSlug(name)
  const url = `${BASE_URL}/?to=${slug}`
  return { name, slug, url }
})

// ── CSV output (semicolon-delimited for Excel compatibility) ──────────────────
const csvHeader = 'No;Name;Slug;URL'
const csvRows = rows.map((r, i) => {
  return `${i + 1};${r.name};${r.slug};${r.url}`
})
const csvContent = [csvHeader, ...csvRows].join('\n')

const outPath = resolve(__dirname, '../guest-urls.csv')
writeFileSync(outPath, '\uFEFF' + csvContent, 'utf-8') // BOM for Excel auto-detection

console.log(`✅  Generated ${rows.length} guest URLs → ${outPath}`)
console.log('\nSample output:')
rows.slice(0, 3).forEach((r) => console.log(`  ${r.name.padEnd(35)} → ${r.url}`))
console.log('  ...')
