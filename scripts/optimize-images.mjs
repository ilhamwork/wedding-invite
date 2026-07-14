/**
 * optimize-images.mjs
 * Converts gallery JPGs → WebP with appropriate dimensions.
 *
 * Tiers:
 *   cover    — 1080px wide  (portrait/mobile cover background)
 *   wide     — 1440px wide  (landscape/desktop cover background)
 *   default  — 1200px wide  (countdown carousel, gallery, story)
 *
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { existsSync, mkdirSync } from 'fs'
import { join, basename, extname } from 'path'

const GALLERY_DIR  = 'public/assets/gallery'
const OUT_DIR      = 'public/assets/gallery/optimized'
const QUALITY      = 78   // WebP quality — good balance of size vs visual

const FILES = [
  // file                        maxWidth  usage
  { file: 'PRITA & ILHAM-96.jpg',  width: 1080, tag: 'cover-mobile'   },
  { file: 'PRITA & ILHAM-53.jpg',  width: 1440, tag: 'cover-desktop'  },
  { file: 'PRITA & ILHAM-4.jpg',   width: 1200, tag: 'gallery'        },
  { file: 'PRITA & ILHAM-16.jpg',  width: 1200, tag: 'gallery'        },
  { file: 'PRITA & ILHAM-37.jpg',  width: 1200, tag: 'gallery'        },
  { file: 'PRITA & ILHAM-53.jpg',  width: 1200, tag: 'gallery-alt'    },
  { file: 'PRITA & ILHAM-96.jpg',  width: 1200, tag: 'gallery-alt'    },
]

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })

// De-duplicate: same file can appear multiple times with different widths.
// Use "<file>@<width>" as the unique key.
const seen = new Set()

for (const { file, width, tag } of FILES) {
  const key = `${file}@${width}`
  if (seen.has(key)) continue
  seen.add(key)

  const src  = join(GALLERY_DIR, file)
  const stem = basename(file, extname(file))
  const dest = join(OUT_DIR, `${stem}-${width}w.webp`)

  process.stdout.write(`  [${tag}] ${file} → ${basename(dest)} ... `)

  const info = await sharp(src)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 5 })
    .toFile(dest)

  const srcKB  = Math.round((await sharp(src).metadata()).size / 1024 ?? 0)
  const destKB = Math.round(info.size / 1024)
  console.log(`done  (${destKB} KB)`)
}

console.log('\n✅  Optimization complete. Output in:', OUT_DIR)
console.log('   Update content.config.js paths to the new /assets/gallery/optimized/ files.')
