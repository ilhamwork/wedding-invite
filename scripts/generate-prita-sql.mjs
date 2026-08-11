import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const raw = readFileSync(
  join(__dirname, '../list-undangan/List Undangan Prita.txt'),
  'utf8'
)

const rows = []

for (const line of raw.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed) continue

  const parts = trimmed.split('\t')
  const name = parts[0].trim()
  const phone = parts[1]?.trim() ?? ''

  if (!name) continue

  const slug = toSlug(name)
  const nameSafe = name.replace(/'/g, "''")
  const phoneSafe = phone ? `'${phone}'` : 'NULL'

  rows.push(`  ('${nameSafe}', '${slug}', 'Prita', ${phoneSafe})`)
}

const sql = `-- Migration: upsert guests from Prita's list
-- Generated: ${new Date().toISOString()}
-- Inserts new rows, updates name/phone if slug already exists

INSERT INTO guests (name, slug, source, phone)
VALUES
${rows.join(',\n')}
ON CONFLICT (slug)
DO UPDATE SET
  name   = EXCLUDED.name,
  phone  = EXCLUDED.phone,
  source = EXCLUDED.source;
`

const outPath = join(__dirname, 'migration_guests_prita.sql')
writeFileSync(outPath, sql, 'utf8')
console.log(`✓ Generated ${rows.length} rows → ${outPath}`)
