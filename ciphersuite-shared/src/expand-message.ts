import { I2OSP, numberArrayXOR } from '.'

// Specified at
/**
 * Standard message expansion function, specified at
 * https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-hash-to-curve-12#section-5.4.1
 * @param msg Message to expand
 * @param DST Domain separation tag
 * @param lenInBytes Length, in bytes, of output to produce
 * @param hashLenInBytes Length, in bytes, of
 * @returns
 */
export function expand_message_xmd(
    msg: Uint8Array,
    DST: Uint8Array,
    lenInBytes: number,
    hash: HashFunction
): Uint8Array {
    const sInBytes = 128 // Input hash size for SHA512, 1024 bits
    const ell = Math.ceil(lenInBytes / hash.outputLen)
    if (ell > 255) {
        throw new Error('Requested expanded length too large.')
    }
    const DSTprime = [...DST, ...I2OSP(DST.length, 1)]
    const Zpad = I2OSP(0, sInBytes)
    const libStr = I2OSP(lenInBytes, 2)
    const msgprime = [...Zpad, ...msg, ...libStr, ...I2OSP(0, 1), ...DSTprime]

    const b0 = hash.hash(msgprime)
    const b1 = hash.hash([...b0, ...I2OSP(1, 1), ...DSTprime])

    const bs = new Array<Array<number>>(ell + 1)
    bs[0] = Array.from(b0)
    bs[1] = Array.from(b1)
    for (let i = 2; i <= ell; ++i) {
        bs[i] = Array.from(hash.hash([...numberArrayXOR(bs[0], bs[i - 1]), ...I2OSP(i, 1), ...DSTprime]))
    }

    const uniformBytes = bs.slice(1).reduce((acc: number[], curr) => acc.concat(curr), [])
    return Uint8Array.from(uniformBytes.slice(0, lenInBytes))
}

export interface HashFunction {
    outputLen: number
    inputLen: number
    hash: (m: Uint8Array | number[] | string) => Uint8Array
}
