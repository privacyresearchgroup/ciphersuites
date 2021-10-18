# Standard Ristretto255-SHA256 ciphersuite implemented with `noble-ed25519`

Implementation of the `OPRF(Ristretto255, SHA256)` ciphersuite from [this Internet-Draft OPRF protocol](https://tools.ietf.org/html/draft-irtf-cfrg-voprf).
Tested using [implementation of the VOPRF specification](https://github.com/privacyresearchgroup/oprf-ts).

Implemented using [`noble-ed25519`](https://github.com/paulmillr/noble-ed25519).
## Usage

Install:

```
yarn add @privacyresearch/noble-ciphersuite-r255s256 noble-ed25519
```
Create a `ciphersuite` object as follows.

```typescript
import { ristretto255SHA512Ciphersuite } from ' @privacyresearch/noble-ciphersuite-r255s256'

const ciphersuite = ristretto255SHA512Ciphersuite(OPRFMode.Verified)

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
