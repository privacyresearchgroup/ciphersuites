import { CURVE } from 'noble-ed25519'
import { bytesToNumberLE, hexToBytes, mod } from './from-noble-ed25519'

export function serializeScalar(n: bigint): Uint8Array {
    // First ensure it is reduced modulo the group order
    const reduced = mod(n, CURVE.n)
    return numberToBytesPadded(reduced, 32)
}

export function deserializeScalar(buf: Uint8Array): bigint {
    return mod(bytesToNumberLE(buf), CURVE.n)
}

export function serializeNumber(n: bigint): Uint8Array {
    const len = Math.ceil((n.toString(16).length - 2) / 2)
    return numberToBytesPadded(n, len)
}
export function deserializeNumber(buf: Uint8Array): bigint {
    return bytesToNumberLE(buf)
}

export function numberToHex(num: number | bigint): string {
    const hex = num.toString(16)
    return hex.length & 1 ? `0${hex}` : hex
}

export function numberToBytesPadded(num: bigint, length = 32): Uint8Array {
    const hex = numberToHex(num).padStart(length * 2, '0')
    return hexToBytes(hex).reverse()
}
