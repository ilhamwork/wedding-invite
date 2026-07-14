import sharp from 'sharp'

const portraits = ['bride', 'groom']

for (const name of portraits) {
  const src  = `public/assets/${name}.jpg`
  const dest = `public/assets/${name}.webp`
  const info = await sharp(src)
    .resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 82, effort: 5 })
    .toFile(dest)
  console.log(`  ${name}.jpg → ${name}.webp (${Math.round(info.size / 1024)} KB)`)
}

console.log('\n✅  Portrait optimization complete.')
