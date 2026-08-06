# IGMPv3 Membership Query format



---

An IGMPv3 Query has a 12-byte base followed by **N** IPv4 source addresses.

~~~text
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |  Type = 0x11 | Max Resp Code |           Checksum            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                         Group Address                         |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 | Resv  |S| QRV |     QQIC      |     Number of Sources (N)     |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Source Address [1]                      |
 +-                                                             -+
 |                              ...                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                       Source Address [N]                      |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
~~~

**Length = 12 + 4N bytes.**

## Field semantics

| Field | Meaning |
|---|---|
| Type | Always 0x11 |
| Max Resp Code | Maximum host response time; direct or floating encoding |
| Checksum | One's-complement checksum over the entire Query |
| Group Address | Zero for General Query; G otherwise |
| Resv | Four reserved bits, transmitted as zero |
| S | Suppress Router-Side Processing |
| QRV | Querier's Robustness Variable; zero means use configured/default value |
| QQIC | Querier's Query Interval Code in seconds, with extended encoding |
| Number of Sources | Number of 32-bit source addresses following |

The **S flag** tells other multicast routers not to perform the ordinary timer updates for this query. It does **not** suppress host responses and does not disable querier election.

## Query subtype is inferred from fields

| Query | Group Address | N | IPv4 destination |
|---|---|---:|---|
| General | 0.0.0.0 | 0 | 224.0.0.1 |
| Group-Specific | G | 0 | G |
| Group-and-Source-Specific | G | Greater than 0 | G |

The Type byte alone cannot distinguish these three queries.

## Example

A Group-and-Source-Specific Query for G = 239.10.10.10 and sources 192.0.2.1 and 192.0.2.2 has N = 2 and total IGMP length **20 bytes**.

At Ethernet MTU 1500, with a 24-byte IPv4 header containing Router Alert, the maximum source count in one Query is 366.

Primary reference: [RFC 3376, Section 4.1](https://www.rfc-editor.org/rfc/rfc3376.html#section-4.1).

