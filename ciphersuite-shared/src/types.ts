// (c) 2021 Privacy Research, LLC https://privacyresearch.io,  GPL-v3-only: see LICENSE file.

export type SerializedElement = Uint8Array
export type SerializedScalar = Uint8Array
export type PrivateInput = Uint8Array
export type PublicInput = Uint8Array
export type Opaque = Uint8Array

/**
 * Operations specified in the RFC
 * https://cfrg.github.io/draft-irtf-cfrg-voprf/draft-irtf-cfrg-voprf.html#name-prime-order-group-dependenc
 *
 * This generic interface is parameterized by three types:
 * * `PointType` is the type of a group element.
 * * `IntType` is the type of underlying integers being used, e.g. `bigint` or `JSBI`.
 * * `ScalarType` represents the type of scalars for the group. Usually scalars will just
 *   be integers (modulo the group order), but for groups with bigger endomorphism rings,
 *   e.g. curves with complex multiplication, more general scalars are possible.
 */
export interface GroupBase<PointType, IntType, ScalarType = IntType> {
    order(): IntType
    identity(): PointType
    readonly G: PointType

    hashToGroup(x: Uint8Array): PointType
    hashToScalar(x: Uint8Array): ScalarType

    randomScalar(): ScalarType

    serializeElement(A: PointType): SerializedElement
    deserializeElement(buf: SerializedElement): PointType
    serializeScalar(s: ScalarType): SerializedElement
    deserializeScalar(buf: SerializedScalar): ScalarType

    // Not explicitly required in specification, but defined there.
    deriveKeyPair(seed: Uint8Array): { skS: IntType; pkS: PointType }
}

/**
 * Writing the group additively, group elements can be added to each other
 * or multiplied by a scalar. This provides a uniform interface to these
 * operations.
 */
export interface GroupOps<PointType, ScalarType> {
    add(A: PointType, B: PointType): PointType
    scalarMultiply(A: PointType, s: ScalarType): PointType
}

/**
 * Protocols also need to perform arithmetic on scalars, and different scalar implementations
 * have different interfaces. For example, adding two native `bigint`s is different from
 * adding two `JSBI` integers. This provides a uniform interface to scalar arithmetic.
 */
export interface ScalarOps<ScalarType> {
    addScalars(a: ScalarType, b: ScalarType): ScalarType
    subtractScalars(a: ScalarType, b: ScalarType): ScalarType
    multiplyScalars(a: ScalarType, b: ScalarType): ScalarType
    invertScalar(a: ScalarType): ScalarType
}

/**
 * A `Group` implements all functions required of a group in
 *  https://cfrg.github.io/draft-irtf-cfrg-voprf/draft-irtf-cfrg-voprf.html
 * and also implements uniform interfaces to group and scalar operations.
 */
export type Group<PointType, IntType, ScalarType = IntType> = GroupBase<PointType, IntType, ScalarType> &
    GroupOps<PointType, ScalarType> &
    ScalarOps<ScalarType>

/**
 * The ciphersuite interface is defined in
 *  https://cfrg.github.io/draft-irtf-cfrg-voprf/draft-irtf-cfrg-voprf.html
 * and provides a `Group`, as hash function, and ciphersuite identifier.
 */
export interface PrimeGroupCiphersuite<PointType, IntType, ScalarType = IntType> {
    GG: Group<PointType, IntType, ScalarType>
    hash(input: Uint8Array): Uint8Array
    ID: number
}
