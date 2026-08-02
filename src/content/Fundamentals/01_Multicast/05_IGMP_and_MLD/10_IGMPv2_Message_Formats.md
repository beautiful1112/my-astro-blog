# IGMPv2 message formats

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IGMPv2 keeps the fixed **8-byte** size but redefines the first byte as a full message Type and uses the second byte for a response-time value.

~~~text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |      Type     | Max Resp Time |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                         Group Address                         |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

## Fields

| Field | Bits | Meaning |
|---|---:|---|
| Type | 8 | Query, v1/v2 Report, or Leave |
| Max Resp Time | 8 | Query response deadline in 0.1-second units |
| Checksum | 16 | Over the complete IGMP message |
| Group Address | 32 | Zero or G according to message subtype |

Max Resp Time is meaningful only in a Query. Reports and Leave messages set it to zero.

## Message matrix

| Message | Type | Group field | IPv4 destination |
|---|---:|---|---|
| General Query | 0x11 | 0.0.0.0 | 224.0.0.1 |
| Group-Specific Query | 0x11 | G | G |
| v1 Report compatibility | 0x12 | G | G |
| v2 Membership Report | 0x16 | G | G |
| Leave Group | 0x17 | G | 224.0.0.2 |

All use IPv4 Protocol 2, TTL 1, and—under IGMPv2—an IPv4 Router Alert option.

## Response to a General Query

A host does **not** reply to the router's unicast address and does not send its report back to 224.0.0.1.

For every joined group G on the receiving interface, the host schedules a randomized response. If its timer expires before it hears another report for G, it sends:

| Field | Value |
|---|---|
| IPv4 destination | G |
| IPv4 Protocol | 2 |
| IPv4 TTL | 1 |
| IGMP Type | 0x16, Version 2 Membership Report |
| Max Resp Time | 0; not meaningful in a Report |
| IGMP Group Address | G |

Example for a host joined to 239.1.1.1 and 239.2.2.2:

~~~text
Router -> 224.0.0.1 : General Query, Group = 0.0.0.0
Host   -> 239.1.1.1 : v2 Report, Group = 239.1.1.1
Host   -> 239.2.2.2 : v2 Report, Group = 239.2.2.2
~~~

IGMPv2 carries only one Group Address, so the host uses a separate Report message for each group. Membership in the special all-systems group 224.0.0.1 is never reported.

The destination G allows other members of G to hear the response and suppress their own pending report. Multicast routers receive the report as local multicast control traffic; unicast addressing to a particular router is unnecessary and would not support suppression.

## Structural improvement over v1

The Query can now say:

- “Report any group within 10 seconds”: Group = zero, Max Resp Time = 100.
- “Does anyone still want G? Reply within 1 second”: Group = G, Max Resp Time = 10.

The explicit response deadline permits fast last-member checks without making every periodic query aggressive.

## Compatibility rule

An IGMPv2 implementation recognizes an 8-byte message by Type and ignores bytes beyond the first 8 for recognized v1/v2 types. A v1 Query appears as type 0x11 with Max Resp Time zero; a v2 host interprets that zero as 100 deciseconds.

Primary reference: [RFC 2236, Sections 2–3](https://www.rfc-editor.org/rfc/rfc2236.html).
