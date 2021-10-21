import { latin1ToBytes } from '..'
import { HashInput, IETF_SPAKE2_HI_CFG, IETF_VOPRF_HI_CFG } from '../hash-input'

describe('Test HashInput helper', () => {
    const OPRF_SPEC_ID = Uint8Array.from([86, 79, 80, 82, 70, 48, 55, 45]) // "VOPRF07-"

    test('IETF-VOPRF hash input', () => {
        const hi = new HashInput(OPRF_SPEC_ID, IETF_VOPRF_HI_CFG)
        hi.update(Uint8Array.from([1]))
            .update(Uint8Array.from([2, 2]))
            .update(Uint8Array.from([3, 3, 3]))
            .update('VOPRF')

        const expected = Uint8Array.from([
            86, 79, 80, 82, 70, 48, 55, 45, 0, 1, 1, 0, 2, 2, 2, 0, 3, 3, 3, 3, 0, 5, 86, 79, 80, 82, 70,
        ])
        expect(hi.data).toEqual(expected)
    })
    test('IETF-SPAKE2 hash input', () => {
        const hi = new HashInput(latin1ToBytes('SPAKE2+ draft-01'), IETF_SPAKE2_HI_CFG)
        hi.update(Uint8Array.from([1]))
            .update(Uint8Array.from([2, 2]))
            .update(Uint8Array.from([3, 3, 3]))

        const expected = Uint8Array.from([
            ...latin1ToBytes('SPAKE2+ draft-01'),
            1,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            1,
            2,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            2,
            2,
            3,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            3,
            3,
            3,
        ])
        expect(hi.data).toEqual(expected)
    })
})
