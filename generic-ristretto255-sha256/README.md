# Standard Ristretto255-SHA256 ciphersuite implemented with `@privacyresearch/ed25519-ts`

Implementation of the `OPRF(Ristretto255, SHA256)` ciphersuite from
[this Internet-Draft OPRF protocol](https://tools.ietf.org/html/draft-irtf-cfrg-voprf). Tested using
[implementation of the VOPRF specification](https://github.com/privacyresearchgroup/oprf-ts).

This is a direct port of the `OPRF(Ristretto255, SHA256)` ciphersuite in
[implementation of the VOPRF specification](https://github.com/privacyresearchgroup/oprf-ts), allowing it to be used
in other protocols.

## Usage

Install:

```
yarn add @privacyresearch/generic-ciphersuite-r255s256
```

Create a `ciphersuite` object as follows.

```typescript
import { ristretto255SHA512Ciphersuite } from '@privacyresearch/generic-ciphersuite-r255s256'

// The ciphersuite requires an implementation of the `Ed25519Type<IntType>` interface. We'll use
// @privacyresearch/ed25519-ts and JSBI for that. You will need to `yarn add jsbi @privacyresearch/ed25519-ts`
for this to work
import { makeED } from '@privacyresearch/ed25519-ts'
import JSBI from 'jsbi'

const ciphersuite = ristretto255SHA512Ciphersuite<JSBI>(ed, OPRFMode.Verified)

// Derive some keys
const seed = hexToBytes('a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3a3')
const skSm = hexToBytes('ac37d5850510299406ea8eb8fa226a7bfc2467a4b070d6c7bf667948b9600b00')
const pkSm = hexToBytes('0c0254e22063cae3e1bae02fb6fa20882664a117c0278eda6bda3372c0dd9860')

const { skS, pkS } = ciphersuite.GG.deriveKeyPair(seed)
const skSBytes = ciphersuite.GG.serializeScalar(skS)
const pkSBytes = ciphersuite.GG.serializeElement(pkS)

```
Now the `ciphersuite` object can be passed to [consuming protocols](https://github.com/privacyresearchgroup/oprf-ts).

## License

(c) 2021 Privacy Research, LLC [(https://privacyresearch.io)](https://privacyresearch.io), see LICENSE file.
