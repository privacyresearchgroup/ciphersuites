// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import { ExtendedPoint } from 'noble-ed25519'
import { PrimeGroupCiphersuite, OPRFCiphersuite, OPRFMode } from './types'
import { Ristretto255Group } from './group'
import { ciphersuiteHash } from './hash'

export function ristretto255SHA512Ciphersuite(mode: OPRFMode): PrimeGroupCiphersuite<ExtendedPoint, bigint> {
    return {
        GG: new Ristretto255Group(mode),
        ID: OPRFCiphersuite.Ristretto255SHA512,
        hash: ciphersuiteHash,
    }
}
