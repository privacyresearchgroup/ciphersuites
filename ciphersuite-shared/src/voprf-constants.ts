// Ciphersuite IDs and modes for POPRFs in  https://cfrg.github.io/draft-irtf-cfrg-voprf/draft-irtf-cfrg-voprf.html
export enum OPRFCiphersuite {
    Ristretto255SHA512 = 0x0001,
    Decaf448SHAKE256 = 0x0002,
    P256SHA256 = 0x0003,
    P384SHA384 = 0x0004,
    P521SHA512 = 0x0005,
}

export enum OPRFMode {
    Base = 0,
    Verified = 1,
}

export const Nh = {
    [OPRFCiphersuite.Ristretto255SHA512]: 64,
    [OPRFCiphersuite.Decaf448SHAKE256]: 64,
    [OPRFCiphersuite.P256SHA256]: 32,
    [OPRFCiphersuite.P384SHA384]: 48,
    [OPRFCiphersuite.P521SHA512]: 64,
}
