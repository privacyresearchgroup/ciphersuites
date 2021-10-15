// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import { Nh, OPRFCiphersuite, expand_message_xmd as shared_expand_xmd } from '@privacyresearch/ciphersuite-shared'
import { sha512 } from 'hash.js'

// Specified at https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-hash-to-curve-12#section-5.4.1
export function expand_message_xmd(msg: Uint8Array, DST: Uint8Array, lenInBytes: number): Uint8Array {
    return shared_expand_xmd(msg, DST, lenInBytes, Nh[OPRFCiphersuite.Ristretto255SHA512])
}

export function ciphersuiteHash(input: Uint8Array): Uint8Array {
    return Uint8Array.from(sha512().update(input).digest())
}
