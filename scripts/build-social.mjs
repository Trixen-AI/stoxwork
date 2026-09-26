// Share and install images, rendered from the same mark and brand font as the logo:
//   public/og.png                 1200x630 link preview (X, Telegram, Discord, Slack)
//   public/apple-touch-icon.png   180x180
//   public/icon-192.png, icon-512.png   web app manifest icons
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { Resvg } from '@resvg/resvg-js'
import opentype from 'opentype.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const font = opentype.parse(readFileSync(path.join(import.meta.dirname, 'fonts/SchibstedGrotesk-600.ttf')).buffer)

const INK = '#0a0a0b'
const BRAND = '#f98500'
const MARK_PATHS = ['M13.2 12V28', 'M13.2 28H22', 'M13.2 20H25.4', 'M13.2 12H28.8']

const mark = (x, y, size) =>
  `<g transform="translate(${x} ${y}) scale(${size / 40})">` +
  `<rect width="40" height="40" rx="10" fill="${BRAND}"/>` +
  MARK_PATHS.map((d) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="4.4" stroke-linecap="round"/>`).join('') +
  `</g>`

/** Text as outlined paths, so the PNG never depends on an installed font. */
function text(str, x, y, size, fill, tracking = -0.012) {
  let cx = x
  const parts = []
  for (const ch of str) {
    const g = font.charToGlyph(ch)
    parts.push(g.getPath(cx, y, size).toPathData(2))
    cx += (g.advanceWidth / font.unitsPerEm) * size + tracking * size
  }
  return `<path d="${parts.join(' ')}" fill="${fill}"/>`
}

const png = (svg, width) => new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng()
const out = (rel, data) => {
  writeFileSync(path.join(ROOT, rel), data)
  console.log('wrote', rel, data.length, 'bytes')
}

/* ---- OG image: same devices as the hero (grid, rising bars, gold accent line) --- */
const W = 1200
const H = 630
const grid = Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${H}" stroke="#ffffff0d"/>`).join('') +
  Array.from({ length: 7 }, (_, i) => `<line x1="0" y1="${i * 100 + 15}" x2="${W}" y2="${i * 100 + 15}" stroke="#ffffff0d"/>`).join('')
const heights = [70, 104, 86, 128, 98, 150, 118, 92, 140, 176, 124, 96, 150, 196, 136, 110]
const bars = heights.map((h, i) => `<rect x="${736 + i * 28}" y="${560 - h}" width="14" height="${h}" rx="7" fill="url(#bar)"/>`).join('')

const og = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0a0a0b"/><stop offset="1" stop-color="#17100a"/></linearGradient>
    <linearGradient id="bar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${BRAND}" stop-opacity="0.75"/><stop offset="1" stop-color="#b35f00" stop-opacity="0.08"/></linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.9" r="0.6"><stop offset="0" stop-color="#b35f00" stop-opacity="0.35"/><stop offset="1" stop-color="#b35f00" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  ${grid}
  ${bars}
  ${mark(80, 80, 64)}
  ${text('EquiYield', 164, 128, 44, '#ffffff')}
  ${text('Your USDG.', 80, 330, 92, '#ffffff', -0.03)}
  ${text('Put to work.', 80, 432, 92, BRAND, -0.03)}
  ${text('Tokenized stock vaults on Solana', 80, 520, 30, '#ffffff80')}
  ${text('equiyield.xyz', 80, 570, 24, '#ffffff4d')}
</svg>`
out('public/og.png', png(og, W))

/* ---- square icons: the mark on the ink background, 12% padding ------------------ */
const icon = (size) => {
  const pad = Math.round(size * 0.12)
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="${INK}"/>
  ${mark(pad, pad, size - pad * 2)}
</svg>`
}
out('public/apple-touch-icon.png', png(icon(180), 180))
out('public/icon-192.png', png(icon(192), 192))
out('public/icon-512.png', png(icon(512), 512))
