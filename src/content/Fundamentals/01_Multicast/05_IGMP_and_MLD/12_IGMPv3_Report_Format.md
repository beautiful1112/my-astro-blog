# IGMPv3 Membership Report format

IGMPv3 replaces the one-group report with a container holding **M Group Records**.

## Report header

~~~text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |  Type = 0x22 |   Reserved    |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |           Reserved            | Number of Group Records (M)   |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Group Record [1]                        |
 +-                                                             -+
 |                              ...                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Group Record [M]                        |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

The fixed report header is **8 bytes**. Reserved fields are sent as zero and ignored on reception.

## Group Record

~~~text
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |  Record Type  | Aux Data Len  |     Number of Sources (N)     |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Multicast Address                       |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Source Address [1]                      |
 +-                                                             -+
 |                              ...                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Source Address [N]                      |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |            Auxiliary Data: Aux Data Len × 32 bits             |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

**Group Record length = 8 + 4N + 4 × Aux Data Len bytes.**

IGMPv3 itself transmits Aux Data Len = 0. The field was reserved for future extensions; receivers include present auxiliary bytes in checksum/length handling but otherwise ignore them.

## Envelope

- IPv4 destination: **224.0.0.22** (all IGMPv3-capable routers).
- IPv4 TTL: 1.
- IPv4 Protocol: 2.
- IPv4 Router Alert: present.

Unlike v1/v2, the IP destination is not the group being reported. The actual group appears inside each Group Record, so one packet can report many groups.

## Example length

One report with two records:

- G1 with three sources: 8 + 12 = 20-byte record.
- G2 with one source: 8 + 4 = 12-byte record.

Total IGMP size = 8-byte header + 20 + 12 = **40 bytes**.

Primary reference: [RFC 3376, Section 4.2](https://www.rfc-editor.org/rfc/rfc3376.html#section-4.2).

