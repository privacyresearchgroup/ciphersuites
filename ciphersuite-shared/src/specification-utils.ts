// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import { OPRFMode } from './voprf-constants'

/**
 * Convert a `latin1` character string into an array of bytes.
 * @param s An ASCII string
 * @returns `s` as an array of bytes
 */
export function latin1ToBytes(s: string): Uint8Array {
    return Uint8Array.from(s.split('').map((s) => s.charCodeAt(0)))
}

/**
 * Integer to octet string primitive, specified in https://datatracker.ietf.org/doc/html/rfc3447#section-4
 * @param i integer to convert
 * @param len length of output octet string
 * @returns Octet string of length `len` encoding the integer in big-endian form.
 */
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
/**
 * Octet string to integer primitive. Specified in https://datatracker.ietf.org/doc/html/rfc3447#section-4
 * @param os Octet string to convert
 * @returns Integer represented by this octet string
 */
export function OS2IP(os: Uint8Array): number {
    return Buffer.from(os)
        .reverse()
        .reduce((total, value, index) => (total += value * 256 ** index), 0)
}

/**
 * Create a byte array specifying the protocol (and version), ciphersuite, and protocol mode. This string
 * is added to hash inputs in the protocol to turn a general purpose hash, like SHA512, into a context-specific
 * hash. This eliminates the feasible possibility of collisions with hashes arising in different contexts.
 *
 * @param mode Mode the protocol is running in. Possible modes are defined by the protocol and represented as one-byte
 * values.
 * @param ciphersuiteID Numeric ID of the ciphersuite being used by the protocol. Possible ciphersuites are defined by the
 * protocol and represented as two-byte values.
 * @param specID A unique identifier for the protocol (with version number if present), e.g. "VOPRF07-" or "RFC2549-"
 * @returns
 */
export function contextString(mode: OPRFMode, ciphersuiteID: number, specID: Uint8Array): Uint8Array {
    const osCSID = I2OSP(ciphersuiteID, 2)
    return Uint8Array.from([...specID, mode, ...osCSID])
}

/**
 * Compare to equal-length byte arrays in noisy-constant time. This implementation
 * is not perfect constant-time (a challenge in Javascript), but effort has been made
 * to remove correlation between the time of execution and properties of the input strings.
 * (See tests for more information.)
 *
 * @param a A byte array
 * @param b A byte array with same length as `a`
 * @returns `true` if the contents of the arrays are equal, `false` otherwise.
 */
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

/**
 * Create a Domain Separation Tag (DST) for hash-to-curve and hash-to-scalar inputs to avoid interfering with other
 * uses of similar functionality. Used in the spirit of https://tools.ietf.org/id/draft-irtf-cfrg-hash-to-curve-06.html#name-domain-separation-requireme
 * Where the `contextString` provides protocol ID, version number, ciphersuite ID, and protocol mode.
 *
 * The `prefixString` distinguishes different encodings used by the same protocol. This function places this information on the front of the
 * DST to be consistent with the VOPRF specification. The hash-to-curve recommendation above places it as a postfix.
 *
 * @param prefixString String identifying the use of an encoding function in a protocol
 * @param contextString String specifying a protocol instantiation, with protocol ID, version, mode, and ciphersuite ID
 * @returns DST as a byte array.
 */
export function makeDST(prefixString: string, contextString: Uint8Array): Uint8Array {
    return Uint8Array.from([...latin1ToBytes(prefixString), ...contextString])
}

/**
 * Bitwise XOR two equal length byte arrays
 * @param a1
 * @param a2
 * @returns array of XORed bytes
 */
export function numberArrayXOR(a1: number[] | Uint8Array, a2: number[] | Uint8Array): Uint8Array {
    if (a1.length !== a2.length) {
        throw new Error('Byte arrays must be same size to XOR.')
    }
    const result = new Uint8Array(a1.length)
    for (let i = 0; i < a1.length; ++i) {
        result[i] = a1[i] ^ a2[i]
    }
    return result
}
