// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

import { ExtendedPoint, CURVE, utils } from 'noble-ed25519'
import { contextString, makeDST } from './specification-utils'
import { Group, OPRFCiphersuite, OPRFMode } from './types'
import { expand_message_xmd } from './hash'
import { mod, invert, encodePrivate } from './from-noble-ed25519'
import { deserializeNumber, serializeScalar, deserializeScalar } from './serialization'

export class Ristretto255Group implements Group<ExtendedPoint, bigint> {
    private _contextString: Uint8Array
    constructor(private _verifyMode: OPRFMode) {
        this._contextString = contextString(_verifyMode, OPRFCiphersuite.Ristretto255SHA512) // _verifyMode ? VERIFY_MODE_CONTEXT_STRING : BASE_MODE_CONTEXT_STRING
    }
    // GroupOps
    add(A: ExtendedPoint, B: ExtendedPoint): ExtendedPoint {
        return A.add(B)
    }

    scalarMultiply(A: ExtendedPoint, s: bigint): ExtendedPoint {
        return A.multiply(s)
    }

    // ScalarOps
    invertScalar(a: bigint): bigint {
        return mod(invert(a, CURVE.n), CURVE.n)
    }
    addScalars(a: bigint, b: bigint): bigint {
        return mod(a + b, CURVE.n)
    }
    subtractScalars(a: bigint, b: bigint): bigint {
        return mod(a - b, CURVE.n)
    }
    multiplyScalars(a: bigint, b: bigint): bigint {
        return mod(a * b, CURVE.n)
    }

    // GroupBase
    order(): bigint {
        return CURVE.n
    }
    identity(): ExtendedPoint {
        return ExtendedPoint.ZERO
    }
    get G(): ExtendedPoint {
        return ExtendedPoint.BASE
    }

    hashToGroup(x: Uint8Array): ExtendedPoint {
        const DST = makeDST('HashToGroup-', this._contextString)
        const uniformBytes = expand_message_xmd(x, DST, 64)
        return ExtendedPoint.fromRistrettoHash(uniformBytes)
    }
    hashToScalar(x: Uint8Array): bigint {
        const DST = makeDST('HashToScalar-', this._contextString)
        const uniformBytes = expand_message_xmd(x, DST, 64)
        return mod(deserializeNumber(uniformBytes), CURVE.n)
    }
    randomScalar(): bigint {
        return encodePrivate(utils.randomPrivateKey())
    }
    serializeElement(A: ExtendedPoint): Uint8Array {
        return A.toRistrettoBytes()
    }
    deserializeElement(buf: Uint8Array): ExtendedPoint {
        return ExtendedPoint.fromRistrettoBytes(buf)
    }
    serializeScalar(s: bigint): Uint8Array {
        return serializeScalar(s)
    }
    deserializeScalar(buf: Uint8Array): bigint {
        return deserializeScalar(buf)
    }
    deriveKeyPair(seed: Uint8Array): { skS: bigint; pkS: ExtendedPoint } {
        const skS = this.hashToScalar(seed)
        const pkS = this.G.multiply(skS)
        return { skS, pkS }
    }
}
