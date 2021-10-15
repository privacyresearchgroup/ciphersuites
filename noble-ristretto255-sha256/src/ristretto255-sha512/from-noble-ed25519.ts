// Note: this egcd-based invert is faster than powMod-based one.

import { CURVE } from 'noble-ed25519'

// Inverses number over modulo
export function invert(number: bigint, modulo: bigint = CURVE.P): bigint {
    if (number === 0n || modulo <= 0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`)
    }
    // Eucledian GCD https://brilliant.org/wiki/extended-euclidean-algorithm/
    let a = mod(number, modulo)
    let b = modulo
    let [x, y, u, v] = [0n, 1n, 1n, 0n]
    while (a !== 0n) {
        const q = b / a
        const r = b % a
        const m = x - u * q
        const n = y - v * q
        ;[b, a] = [a, r]
        ;[x, y] = [u, v]
        ;[u, v] = [m, n]
    }
    const gcd = b
    if (gcd !== 1n) throw new Error('invert: does not exist')
    return mod(x, modulo)
}
export function mod(a: bigint, b: bigint) {
    const res = a % b
    return res >= 0n ? res : b + res
}
export function encodePrivate(privateBytes: Uint8Array): bigint {
    const last = 32 - 1
    const head = privateBytes.slice(0, 32)
    head[0] &= 248
    head[last] &= 127
    head[last] |= 64
    return mod(bytesToNumberLE(head), CURVE.n)
}

// Little Endian
export function bytesToNumberLE(uint8a: Uint8Array): bigint {
    let value = 0n
    for (let i = 0; i < uint8a.length; i++) {
        value += BigInt(uint8a[i]) << (8n * BigInt(i))
    }
    return value
}

// Convert between types
// ---------------------

export function hexToBytes(hex: string): Uint8Array {
    if (hex.length % 2) throw new Error('hexToBytes: received invalid unpadded hex')
    const array = new Uint8Array(hex.length / 2)
    for (let i = 0; i < array.length; i++) {
        const j = i * 2
        array[i] = Number.parseInt(hex.slice(j, j + 2), 16)
    }
    return array
}
