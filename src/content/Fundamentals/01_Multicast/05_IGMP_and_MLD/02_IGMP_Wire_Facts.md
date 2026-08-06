# IGMP wire facts

## IPv4 encapsulation

IGMP is carried directly in IPv4:

| IPv4 field | Required or common value |
|---|---|
| Protocol | **2** |
| TTL | **1** for IGMP messages |
| Router Alert | Required by IGMPv2/v3; value 0 means routers should examine the packet |
| Source | Address assigned to the transmitting interface; special startup cases are implementation-dependent |
| Destination | Depends on query/report/leave type |

IGMP is not TCP or UDP, so there are no ports, sequence numbers, acknowledgments, or transport retransmissions.

## Message types

| Hex type | Meaning |
|---:|---|
| `0x11` | Membership Query; version inferred from length/fields |
| `0x12` | IGMPv1 Membership Report |
| `0x16` | IGMPv2 Membership Report |
| `0x17` | IGMPv2 Leave Group |
| `0x22` | IGMPv3 Membership Report |

IGMPv1 encoded “version 1, type 1/2” as nibbles in the first byte. Those bytes appear as `0x11` and `0x12`, which later specifications treat as full 8-bit message types.

## Checksum

The IGMP checksum is the 16-bit one's-complement checksum over the **entire IGMP message**, with the checksum field set to zero during calculation. It does not include an IPv4 pseudo-header.

## Minimum lengths

| Message | Length |
|---|---:|
| IGMPv1 Query/Report | 8 bytes |
| IGMPv2 Query/Report/Leave | 8 bytes |
| IGMPv3 Query | 12 + 4N bytes |
| IGMPv3 Report | 8 bytes + variable group records |

## Validation checklist

When decoding a capture, check in this order:

1. IPv4 Protocol = 2.
2. TTL = 1.
3. Router Alert presence where required.
4. Destination matches the message role.
5. IGMP length is valid for the apparent version.
6. Checksum is valid.
7. Group and source addresses are meaningful for that query/report subtype.

See the version-specific packet-format documents in this module for bit layouts.

