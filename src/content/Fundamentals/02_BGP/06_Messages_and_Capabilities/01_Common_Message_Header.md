# BGP common message header

Every BGP message begins with the same header (RFC 4271):

- 16-octet **Marker**;
- 2-octet **Length**;
- 1-octet **Type**.

Classic maximum message length is **4096** octets. The **Extended Message** capability (RFC 8654) allows messages up to **65,535** octets for eligible types; **OPEN** remains constrained. Corrupt length or type values are **Message Header Errors** and normally terminate the session.

## Header fields

| Field | Size | Notes |
|---|---|---|
| Marker | 16 octets | All ones after auth negotiation success in classic BGP; must be checked |
| Length | 2 octets | Includes header; enforces min/max bounds |
| Type | 1 octet | Selects message body format |

## Message types

| Type | Name | Role |
|---:|---|---|
| 1 | OPEN | Session negotiation |
| 2 | UPDATE | Advertise/withdraw routes |
| 3 | NOTIFICATION | Fatal error + close |
| 4 | KEEPALIVE | Liveness / OPEN confirm |
| 5 | ROUTE-REFRESH | Request retransmission of Adj-RIB-Out (RFC 2918) |

Related: [OPEN](02_OPEN_Message.md), [UPDATE](03_UPDATE_Message.md), [KEEPALIVE/NOTIFICATION](04_KEEPALIVE_and_NOTIFICATION.md), [Route Refresh](05_Route_Refresh.md).

## Parsing hazards

- Length too small/large → header error, session down;
- Truncated TCP stream → wait for full Length bytes before parsing;
- Extended messages without capability → interoperability failure;
- Middlebox interference corrupting Marker/Length.

## Configuration patterns (extended messages / inspection)

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 ! extended-message capability when supported/needed for large attributes
show bgp neighbors 198.51.100.1 | include Extended|capabilities
```

### Junos

```text
show bgp neighbor 198.51.100.1
# inspect negotiated capabilities including extended-message if present
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
!
show bgp neighbors 198.51.100.1 json
```

## Interactions

| Mechanism | Interaction |
|---|---|
| TCP MSS/MTU | Large UPDATEs need healthy path MTU |
| Capability negotiation | Extended Message must be negotiated |
| RFC 7606 | Body errors may not kill session; header errors still do |
| Packing | Multiple NLRI per UPDATE still bound by message Length |

## Verification

```text
# packet capture filter
tcp port 179
# decode BGP header Length/Type
show bgp neighbors 198.51.100.1
```

Lab checks:

1. Capture OPEN vs KEEPALIVE: same header, different Type, different Length.
2. Confirm negotiated max message size if extended capability present.
3. Induce MTU blackhole; observe session stalls on large UPDATE rather than tidy header error.

## Risks

- Assuming all BGP messages fit 4096 after enabling huge communities/attributes without extended messages.
- Treating any BGP failure as UPDATE policy when the header/length is wrong.
- Capturing only payloads without verifying Marker/Length integrity.

## Interview framing

“Every BGP message starts with Marker, Length, and Type; classic max is 4096 bytes unless Extended Message is negotiated, and header errors reset the session.”

---
