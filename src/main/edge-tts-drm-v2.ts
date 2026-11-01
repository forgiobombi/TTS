// Adapted from SchneeHertz/node-edge-tts (MIT), src/drm.ts.
// Original copyright (c) 2022 SchneeHertz. See THIRD_PARTY_NOTICES.md.
import { createHash } from 'crypto'

const WINDOWS_EPOCH = 11644473600n
const TRUSTED_CLIENT_TOKEN = '6A5AA1D4EAFF4E9FB37E23D68491D6F4'

// Fixed protocol prefix for the updated Edge Read Aloud token.
const SALT = Buffer.from(
  'Q29weXJpZ2h0IChDKSBNaWNyb3NvZnQg' +
  'Q29ycG9yYXRpb24uIEFsbCByaWdodHMgcmVzZXJ2ZWQu',
  'base64',
)
const COEFFICIENTS: ReadonlyArray<readonly [number, number]> = [
  [0xe82e91b1, 0xb32700d0], [0x44de24c6, 0x88dff51d],
  [0x3beb65bc, 0x29514038], [0xc89c5933, 0xb328cbdf],
  [0x8d1ec211, 0xd405b4d5], [0x314ef5d5, 0x26e55f3c],
  [0xe92491b1, 0x607801c6], [0xf0a5b9d5, 0x82b2c1fb],
  [0x06064cf3, 0xfa51a3da], [0xda79fa60, 0x207cc464],
  [0xbed20560, 0x3c3c74f3], [0x89f9c9f8, 0xd2d14b61],
  [0x35fa38c6, 0xbb04a2c1], [0xcb49e3c6, 0xc5626167],
]
const mul = Math.imul
const rol16 = (x: number): number => ((x << 16) | (x >>> 16)) >>> 0

function cs64Digest(data: Buffer, shaDigest: Buffer): Buffer {
  const keyA = (shaDigest.readUInt32LE(0) | 1) >>> 0
  const keyB = (shaDigest.readUInt32LE(4) | 1) >>> 0
  const factors: [number, number] = [
    mul(keyA, 0x82893933) >>> 0,
    mul(keyB, 0x82893933) >>> 0,
  ]
  const terms = COEFFICIENTS.map(([coefficient], i) => mul(coefficient, factors[i % 2]) >>> 0)
  const offsets = COEFFICIENTS.map(([, offset]) => offset)
  const padded = Buffer.alloc(Math.ceil((data.length + 1) / 8) * 8)
  padded.set(data, 1)
  for (let i = 0; i < padded.length / 4; i++) {
    const word = padded.readUInt32LE(i * 4)
    let term = mul(word, i % 2 === 0 ? keyA : keyB)
    let offset = mul(rol16(word), i % 2 === 0 ? 0xef0569fb : 0xc31713db)
    if (i === 0) {
      term = (term + mul(0xf2f90b1a, factors[0])) >>> 0
      offset = (offset + 0x0b1a0000) >>> 0
    }
    terms.push(term >>> 0)
    offsets.push(offset >>> 0)
  }

  let swapAcc = 0, swapLast = 0, state = 0, acc = 0
  for (let i = 0; i < terms.length; i += 2) {
    const x = terms[i], y = terms[i + 1]
    let t = rol16((offsets[i] + x) >>> 0)
    let q = mul(t, 0x76f50f34)
    swapAcc += (mul(rol16(q), 0xc3efea97) + q) >>> 0
    t = rol16((offsets[i + 1] + y) >>> 0)
    q = mul(t, 0x1881ce3c)
    swapLast = (mul(rol16(q), 0x35bd1ec9) + q) >>> 0
    swapAcc = (swapAcc + swapLast) >>> 0

    state = (mul(state, keyA) + x) >>> 0
    for (const k of [0xcf98b111, 0x87085b9f, 0x12ceb96d, 0x257e1d83]) {
      state = mul(rol16(state), k) >>> 0
    }
    acc += state
    t = (mul(state, keyB) + y) >>> 0
    t = mul(rol16(t), 0xa27416f5) >>> 0
    t = mul(rol16(t), 0xd38396ff) >>> 0
    state = mul(rol16(mul(rol16(t), 0x7c932b89)), 0xbfa49f69) >>> 0
    acc = (acc + state) >>> 0
  }
  const result = Buffer.allocUnsafe(8)
  result.writeUInt32LE((swapLast ^ state) >>> 0, 0)
  result.writeUInt32LE((swapAcc ^ acc) >>> 0, 4)
  return result
}

/** Produce the 16-hex CS64 + 64-hex SHA256 token required since Oct 2026. */
export function generateSecMsGecV2(unixSeconds = Date.now() / 1000): string {
  if (!Number.isFinite(unixSeconds)) throw new TypeError('Invalid timestamp')
  const seconds = BigInt(Math.floor(unixSeconds)) + WINDOWS_EPOCH
  const rounded = seconds - seconds % 300n
  const data = Buffer.from(`${rounded * 10000000n}${TRUSTED_CLIENT_TOKEN}`, 'ascii')
  const sha = createHash('sha256').update(SALT).update(data).digest()
  return `${cs64Digest(data, sha).toString('hex').toUpperCase()}-${sha.toString('hex').toUpperCase()}`
}
