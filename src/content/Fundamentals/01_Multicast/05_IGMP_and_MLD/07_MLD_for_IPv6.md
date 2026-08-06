# MLD for IPv6

MLD is the IPv6 local-link listener protocol. It is carried as ICMPv6 rather than as a separate IPv6 Next Header value.

## Version mapping

| Capability | MLDv1 | MLDv2 |
|---|---|---|
| Closest IGMP model | IGMPv2 | IGMPv3 |
| Query | ICMPv6 130 | ICMPv6 130 |
| Report | ICMPv6 131 | ICMPv6 143 |
| Explicit stop | Done, ICMPv6 132 | State-change record |
| Source filtering | No | INCLUDE/EXCLUDE |
| Report destination | Group being reported | `ff02::16` |

## IPv6 envelope

MLD messages require:

- IPv6 Hop Limit = 1.
- A Hop-by-Hop Options header containing Router Alert.
- A valid link-local source for normal router processing; MLDv2 defines a limited unspecified-source startup case.
- An ICMPv6 checksum, which includes the IPv6 pseudo-header.

Querier election uses the numerically lowest link-local source address.

## Query version distinction

- MLDv1 Query: exactly 24 bytes.
- MLDv2 Query: at least 28 bytes.
- Other lengths, such as 26 bytes, are invalid.

MLDv2 uses 128-bit multicast/source addresses and a 16-bit Maximum Response Code, but its filter modes and six record types mirror IGMPv3.

MLD matters even without a user multicast application: IPv6 uses multicast extensively for Neighbor Discovery, Duplicate Address Detection, and solicited-node groups. Do not disable or filter MLD indiscriminately.

