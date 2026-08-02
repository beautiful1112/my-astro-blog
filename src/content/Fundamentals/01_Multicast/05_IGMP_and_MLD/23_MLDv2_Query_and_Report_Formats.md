# MLDv2 Query and Report formats

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

MLDv2 mirrors IGMPv3 semantics with 128-bit IPv6 group/source addresses and ICMPv6 framing.

## Query

~~~text
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 | Type = 130    |   Code = 0    |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |     Maximum Response Code     |           Reserved            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                                                               |
 |                    IPv6 Multicast Address                     |
 |                         (128 bits)                            |
 |                                                               |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 | Resv  |S| QRV |     QQIC      |     Number of Sources (N)     |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                 IPv6 Source Address [1] (128 bits)            |
 +-                                                             -+
 |                              ...                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

**Length = 28 + 16N bytes.**

- General Query: multicast address ::, N = 0, destination ff02::1.
- Multicast-Address-Specific Query: G, N = 0, destination G.
- Multicast-Address-and-Source-Specific Query: G, N > 0, destination G.

Maximum Response Code is 16 bits and represents milliseconds:

- If code < 32768, the value is the code directly.
- Otherwise the bit layout is `1 | exp(3 bits) | mantissa(12 bits)`.
- Decoded milliseconds = `(mantissa OR 0x1000) << (exponent + 3)`.

QQIC uses the same 8-bit seconds encoding as IGMPv3.

## Version 2 Report

~~~text
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 | Type = 143    |   Code = 0    |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |           Reserved            | Number of Address Records (M) |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                 Multicast Address Record [1]                  |
 +-                                                             -+
 |                              ...                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

Each record contains:

- Record Type: the same six meanings as IGMPv3.
- Aux Data Len.
- Number of Sources.
- 128-bit multicast address.
- N × 128-bit source addresses.
- Optional auxiliary data.

With no auxiliary data, one Multicast Address Record is **20 + 16N bytes**. The full report is 8 bytes plus all record lengths.

Reports use destination **ff02::16**. Report suppression is removed, as in IGMPv3.

## IPv6-specific validation

- Hop Limit must be 1.
- Router Alert must appear in a Hop-by-Hop header.
- Checksum includes the IPv6 pseudo-header.
- Query version is determined by length: 24 bytes = v1; at least 28 bytes = v2.

Primary reference: [RFC 3810, Section 5](https://www.rfc-editor.org/rfc/rfc3810.html#section-5).
