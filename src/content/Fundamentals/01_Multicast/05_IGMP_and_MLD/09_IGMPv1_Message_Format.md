# IGMPv1 message format

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

IGMPv1 uses one fixed **8-byte** message layout for both Query and Report.

~~~text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |Version| Type  |    Unused     |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                         Group Address                         |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

## Fields

| Field | Bits | Meaning |
|---|---:|---|
| Version | 4 | Value 1 |
| Type | 4 | 1 = Host Membership Query; 2 = Host Membership Report |
| Unused | 8 | Sent as zero; ignored on receipt |
| Checksum | 16 | One's-complement checksum over all 8 bytes |
| Group Address | 32 | Zero in Query; group G in Report |

The combined first octet is therefore:

- Query: binary **0001 0001** = **0x11**
- Report: binary **0001 0010** = **0x12**

Later IGMP specifications describe this whole octet as an 8-bit Type, which is why packet decoders display **0x11** and **0x12** rather than separate v1 nibbles.

## IPv4 envelope

| Message | IPv4 destination | IGMP Group Address | TTL |
|---|---|---|---:|
| General Query | 224.0.0.1 | 0.0.0.0 | 1 |
| v1 Report | G | G | 1 |

IGMPv1 has no encoded response time. The host uses a fixed maximum report delay **D = 10 seconds**.

## What cannot be expressed

There is no:

- Group-specific Query.
- Leave message.
- Source address list.
- INCLUDE/EXCLUDE mode.
- Querier parameters.

The router learns only that at least one host on the link wants G.

Primary reference: [RFC 1112, Appendix I](https://www.rfc-editor.org/rfc/rfc1112.html).

