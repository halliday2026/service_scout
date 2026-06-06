// Generates solid-blue placeholder PNGs for icon-192.png and icon-512.png
// Run: node scripts/generate-icons.mjs
// Replace with real icon variants from app-icon.png before deploying to production.
// Example using ImageMagick:
//   magick public/assets/app-icon.png -resize 192x192 public/assets/icon-192.png
//   magick public/assets/app-icon.png -resize 512x512 public/assets/icon-512.png

import { writeFileSync, mkdirSync } from 'fs'
import { deflateSync } from 'zlib'

const CRC_TABLE = (() => {
  const t = new Uint32Array(256)
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let j = 0; j < 8; j++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[i] = c
  }
  return t
})()

function crc32(buf) {
  let crc = 0xffffffff
  for (const byte of buf) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 0xff]
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(data.length)
  const combined = Buffer.concat([typeBytes, data])
  const crcBuf = Buffer.alloc(4)
  crcBuf.writeUInt32BE(crc32(combined))
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf])
}

function createSolidPNG(w, h, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdrData = Buffer.alloc(13)
  ihdrData.writeUInt32BE(w, 0)
  ihdrData.writeUInt32BE(h, 4)
  ihdrData[8] = 8  // bit depth
  ihdrData[9] = 2  // color type: RGB
  const ihdr = chunk('IHDR', ihdrData)

  const rowSize = 1 + w * 3
  const raw = Buffer.alloc(h * rowSize)
  for (let y = 0; y < h; y++) {
    raw[y * rowSize] = 0 // filter: None
    for (let x = 0; x < w; x++) {
      raw[y * rowSize + 1 + x * 3]     = r
      raw[y * rowSize + 1 + x * 3 + 1] = g
      raw[y * rowSize + 1 + x * 3 + 2] = b
    }
  }
  const idat = chunk('IDAT', deflateSync(raw))
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([sig, ihdr, idat, iend])
}

// Brand blue #1D6FE8 = rgb(29, 111, 232)
mkdirSync('public/assets', { recursive: true })
writeFileSync('public/assets/icon-192.png', createSolidPNG(192, 192, 29, 111, 232))
writeFileSync('public/assets/icon-512.png', createSolidPNG(512, 512, 29, 111, 232))
// Also create app-icon.png placeholder if not present
import { existsSync } from 'fs'
if (!existsSync('public/assets/app-icon.png')) {
  writeFileSync('public/assets/app-icon.png', createSolidPNG(512, 512, 29, 111, 232))
  console.log('Created placeholder app-icon.png — replace with your real icon.')
}
console.log('Icons generated: icon-192.png (192×192), icon-512.png (512×512)')
