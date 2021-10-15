# Type Definitions and Constants for Standard Ciphersuites

Cryptographic protocols are often parameterized by ciphersuites and share common functions
for data serialization, message expansion, and domain separation. A ciphersuite may also
specify algebraic structures used by the protocol, and these structures need to expose a common
interface to the protocol.

This library is a work in progress, exposing ciphersuites dependent on a prime-order group
(in practice often from an elliptic curve) and a hash function. The interfaces and functions
come directly from [this Internet-Draft OPRF protocol](https://tools.ietf.org/html/draft-irtf-cfrg-voprf)
and are used in an [implementation of this specification](https://github.com/privacyresearchgroup/oprf-ts).
Thus, at this point in development, the interfaces and function collections will be incomplete. As we
implement more protocols using external ciphersuites developed with this library, we will expand
the capabilities of the library and improve the abstractions.

## License

(c) 2021 Privacy Research, LLC [(https://privacyresearch.io)](https://privacyresearch.io), see LICENSE file.
