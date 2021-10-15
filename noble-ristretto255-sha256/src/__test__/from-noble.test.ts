import { invert } from '../ristretto255-sha512/from-noble-ed25519'

describe('test functions copied from noble-ed25519', () => {
    test('invert throws on bad input', () => {
        expect(() => {
            invert(0n)
        }).toThrow()
        expect(() => {
            invert(6n, 10n)
        }).toThrow()
    })
})
