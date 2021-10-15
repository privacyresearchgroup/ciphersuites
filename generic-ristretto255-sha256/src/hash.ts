// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import {
    Nh,
    OPRFCiphersuite,
    expand_message_xmd as shared_expand_message_xmd,
    HashFunction,
} from '@privacyresearch/ciphersuite-shared'
import { sha512 } from 'hash.js'

const sha512Hash: HashFunction = {
    inputLen: 128,
    outputLen: Nh[OPRFCiphersuite.Ristretto255SHA512],
    hash: (m: string | number[] | Uint8Array) => Uint8Array.from(sha512().update(m).digest()),
}

// Specified at https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-hash-to-curve-12#section-5.4.1
export function expand_message_xmd(msg: Uint8Array, DST: Uint8Array, lenInBytes: number): Uint8Array {
    return shared_expand_message_xmd(msg, DST, lenInBytes, sha512Hash)
}

export function ciphersuiteHash(input: Uint8Array): Uint8Array {
    return Uint8Array.from(sha512().update(input).digest())
}
