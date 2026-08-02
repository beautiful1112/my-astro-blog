# MLDv1 message format

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

MLDv1 uses ICMPv6 Query, Report, and Done messages with a fixed **24-byte ICMPv6 body**.

~~~text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |      Type     |   Code = 0    |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 | Maximum Response Delay        |           Reserved            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                                                               |
 |                    IPv6 Multicast Address                     |
 |                         (128 bits)                            |
 |                                                               |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

## Message types and destinations

| Message | ICMPv6 Type | Address field | IPv6 destination |
|---|---:|---|---|
| General Query | 130 | :: | ff02::1 |
| Multicast-Address-Specific Query | 130 | G | G |
| Listener Report | 131 | G | G |
| Listener Done | 132 | G | ff02::2 |

Maximum Response Delay is in milliseconds. It is meaningful in Queries and zero in Reports/Done.

## IPv6 envelope

- Hop Limit = 1.
- Hop-by-Hop header contains Router Alert for MLD.
- Normal source is a link-local IPv6 address.
- ICMPv6 checksum includes the IPv6 pseudo-header, unlike the IGMP checksum.

MLDv1 is functionally close to IGMPv2: group-only state, explicit Done, group-specific query, and report suppression.

Primary reference: [RFC 2710, Sections 3–6](https://www.rfc-editor.org/rfc/rfc2710.html).

