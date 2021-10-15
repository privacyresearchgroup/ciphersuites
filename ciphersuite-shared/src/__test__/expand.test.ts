import { makeDST, contextString, OPRFMode, OPRFCiphersuite, expand_message_xmd, Nh, HashFunction } from '..'
import { sha512 } from 'hash.js'

const sha512Hash: HashFunction = {
    inputLen: 128,
    outputLen: Nh[OPRFCiphersuite.Ristretto255SHA512],
    hash: (m: string | number[] | Uint8Array) => Uint8Array.from(sha512().update(m).digest()),
}

describe('test standard expansion', () => {
    const OPRF_SPEC_ID = Uint8Array.from([86, 79, 80, 82, 70, 48, 55, 45]) // "VOPRF07-"
    test('Reject expansion when too big', () => {
        const dst = makeDST(
            'ExpansionTest-',
            contextString(OPRFMode.Base, OPRFCiphersuite.Ristretto255SHA512, OPRF_SPEC_ID)
        )
        expect(() => {
            expand_message_xmd(
                Uint8Array.from([0, 0, 0]),
                dst,
                255 * Nh[OPRFCiphersuite.Ristretto255SHA512] + 1,
                sha512Hash
            )
        }).toThrow('Requested expanded length too large.')
    })

    test('Large expansion', () => {
        const dst = makeDST(
            'ExpansionTest-',
            contextString(OPRFMode.Base, OPRFCiphersuite.Ristretto255SHA512, OPRF_SPEC_ID)
        )
        expect(() => {
            expand_message_xmd(
                Uint8Array.from([0, 0, 0]),
                dst,
                255 * Nh[OPRFCiphersuite.Ristretto255SHA512],
                sha512Hash
            )
        }).not.toThrow('Requested expanded length too large.')
    })
})
