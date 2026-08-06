# IGMPv1, IGMPv2, and IGMPv3

## Capability comparison

| Capability | IGMPv1 | IGMPv2 | IGMPv3 |
|---|---|---|---|
| Base RFC | RFC 1112 | RFC 2236 | RFC 3376 |
| Query type | `0x11` | `0x11` | `0x11` |
| Report type | `0x12` | `0x16` | `0x22` |
| Fixed report length | 8 bytes | 8 bytes | No; variable |
| General Query | Yes | Yes | Yes |
| Group-Specific Query | No | Yes | Yes |
| Group-and-Source-Specific Query | No | No | Yes |
| Explicit leave signal | No | `0x17` Leave | State-change group record |
| Source filtering | No | No | INCLUDE/EXCLUDE |
| Multiple groups per report | No | No | Yes |
| Report suppression | Yes | Yes | Removed for v3 reports |
| Querier election in version spec | Not defined by v1 host spec | Lowest IPv4 address | Lowest IPv4 address |

## Structural evolution

### IGMPv1

One fixed 8-byte structure carries either a general Query or a Report. The first byte is two 4-bit fields: Version and Type. There is no response-time field and no leave message.

### IGMPv2

The same 8 bytes are reinterpreted as an 8-bit Type plus an 8-bit Max Response Time. Group-specific queries and Leave Group messages reduce leave latency.

### IGMPv3

The query grows to at least 12 bytes and can name sources. The report changes completely: one report can contain many group records, and each record carries filter mode, group, and a source list.

## Semantic evolution

- v1/v2 express **(*,G)-style link interest**: someone wants group G, source unspecified.
- v3 can express **(S,G)-style interest** with `INCLUDE {S}`, enabling native SSM receiver signaling.
- `EXCLUDE {}` in v3 is the representation closest to an ordinary v1/v2 ASM join.
- `INCLUDE {}` represents no desired sources and is also the conceptual no-membership state.

The packet format changed because a single group address is insufficient to express source-filter state.

