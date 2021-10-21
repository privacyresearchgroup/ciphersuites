import { I2OSP, latin1ToBytes } from '.'

export interface HashInputConfig {
    byteOrder: 'BE' | 'LE'
    lengthPrefixSizeBytes: number
}

export const IETF_VOPRF_HI_CFG: HashInputConfig = {
    byteOrder: 'BE',
    lengthPrefixSizeBytes: 2,
}

export const IETF_SPAKE2_HI_CFG: HashInputConfig = {
    byteOrder: 'LE',
    lengthPrefixSizeBytes: 8,
}

export class HashInput {
    private _buf: number[] = []
    // If the prefix is a string it MUST be latin1 encoded
    // The VOPRF spec uses 2-byte length prefixes. SPAKE2+ uses 8-byte prefixes
    constructor(prefix: Uint8Array | string, private _config: HashInputConfig) {
        this._buf = [...ensureUint8Array(prefix)]
    }

    update(data: Uint8Array | string): HashInput {
        const uint8Data = ensureUint8Array(data)
        this._buf = [
            ...this._buf,
            ...xEndianI2OSP(uint8Data.length, this._config.lengthPrefixSizeBytes, this._config.byteOrder),
            ...uint8Data,
        ]
        return this
    }

    get data(): Uint8Array {
        return Uint8Array.from(this._buf)
    }
}

function xEndianI2OSP(n: number, len: number, byteOrder: 'BE' | 'LE'): Uint8Array {
    return byteOrder === 'BE' ? I2OSP(n, len) : I2OSP(n, len).reverse()
}

function ensureUint8Array(arg: Uint8Array | string): Uint8Array {
    return typeof arg === 'string' ? latin1ToBytes(arg) : arg
}
