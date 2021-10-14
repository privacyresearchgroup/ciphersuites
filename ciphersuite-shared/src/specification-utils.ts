// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import { OPRFCiphersuite, OPRFMode } from './types'

export const Nh = {
    [OPRFCiphersuite.Ristretto255SHA512]: 64,
    [OPRFCiphersuite.Decaf448SHAKE256]: 64,
    [OPRFCiphersuite.P256SHA256]: 32,
    [OPRFCiphersuite.P384SHA384]: 48,
    [OPRFCiphersuite.P521SHA512]: 64,
}

export function latin1ToBytes(s: string): Uint8Array {
    return Uint8Array.from(s.split('').map((s) => s.charCodeAt(0)))
}

export function I2OSP(i: number, len: number): Uint8Array {
    if (i >= 256 ** len) {
        throw new Error(`Integer to large for ${len} byte array.`)
    }
    const octets = new Uint8Array(len)
    for (const index in octets) {
        octets[index] = Number(i % 256)
        i = i / 256
    }

    return octets.reverse()
}
export function OS2IP(os: Uint8Array): number {
    return Buffer.from(os)
        .reverse()
        .reduce((total, value, index) => (total += value * 256 ** index), 0)
}

export function contextString(mode: OPRFMode, cryptoSuiteId: number, specID: Uint8Array): Uint8Array {
    const osCSID = I2OSP(cryptoSuiteId, 2)
    return Uint8Array.from([...specID, mode, ...osCSID])
}

export function CT_EQUAL(a: Uint8Array, b: Uint8Array): boolean {
    if (a.length !== b.length) {
        throw new Error('Cannot compare arrays of different lengths.')
    }

    // we accumulate with arithmetic instead of boolean operators because it
    // is much more time-consistent than the analogous boolean accumulator:
    /*
    let result = true
    for (let i = 0; i < a.length; ++i) {
        result &&= a[i] === b[i]
    }
    */
    let result = 1
    for (let i = 0; i < a.length; ++i) {
        result *= a[i] === b[i] ? 1 : 0
    }

    return result !== 0
}

export function makeDST(prefixString: string, contextString: Uint8Array): Uint8Array {
    return Uint8Array.from([...latin1ToBytes(prefixString), ...contextString])
}

export function numberArrayXOR(a1: number[] | Uint8Array, a2: number[] | Uint8Array): Uint8Array {
    if (a1.length !== a2.length) {
        throw new Error('Byte arrays must be same size to XOR.')
    }
    const result = new Uint8Array(a1.length)
    for (const i in a1) {
        result[i] = a1[i] ^ a2[i]
    }
    return result
}
