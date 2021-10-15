import { makeDST, contextString, OPRFMode, OPRFCiphersuite, expand_message_xmd, Nh } from '..'

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
                Nh[OPRFCiphersuite.Ristretto255SHA512]
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
                Nh[OPRFCiphersuite.Ristretto255SHA512]
            )
        }).not.toThrow('Requested expanded length too large.')
    })
})
