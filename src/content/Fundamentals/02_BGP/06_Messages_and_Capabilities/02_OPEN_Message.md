# OPEN message

**OPEN** establishes session identity and negotiates behavior. Key fields are version (4), the two-octet My Autonomous System field, Hold Time, BGP Identifier, and optional parameters (capabilities).

Four-octet speakers advertise the **4-byte AS** capability. When peering with a legacy two-octet-only speaker, the two-octet field may carry **AS_TRANS (23456)** while the real ASN is conveyed via capabilities and AS4 path attributes as needed.

## Field checklist

| Field | What to verify |
|---|---|
| Version | 4 |
| My AS | Expected ASN or AS_TRANS |
| Hold Time | Proposal feeding negotiation |
| BGP Identifier | Unique per speaker; stable |
| Capabilities | Families, refresh, GR, ADD-PATH, roles, etc. |

Capability mismatches commonly explain an Established base session with an inactive address family or missing operational feature.

Related: [OPEN negotiation](../05_FSM_and_Timers/02_OPEN_Negotiation.md), [Capability negotiation](06_Capability_Negotiation.md), [AS number space](../03_ASNs_and_Peering/01_AS_Number_Space.md), [Common header](01_Common_Message_Header.md).

## Optional parameters and capabilities

Modern BGP uses capability advertisement inside OPEN optional parameters (RFC 5492). Each capability has a code and value. Peers intersect what both advertise; unidirectional features (e.g. ADD-PATH send vs receive) follow their RFCs.

Unsupported capability handling: generally ignore unknown capabilities; do not confuse that with rejecting a session for ASN/hold/identifier errors.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 bgp router-id 192.0.2.1
 neighbor 198.51.100.1 remote-as 4200000001
 neighbor 198.51.100.1 timers 30 90
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
```

### Junos

```text
set routing-options router-id 192.0.2.1
set routing-options autonomous-system 65000
set protocols bgp group EXT peer-as 4200000001
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp group EXT hold-time 90
```

### FRRouting

```text
router bgp 65000
 bgp router-id 192.0.2.1
 neighbor 198.51.100.1 remote-as 4200000001
 neighbor 198.51.100.1 timers 30 90
```

## Interactions

| Mechanism | Interaction |
|---|---|
| FSM OpenSent/OpenConfirm | OPEN exchange lives in these states |
| Hold negotiation | From OPEN Hold Time fields |
| MP-BGP | Families exist only if capability present |
| Collision | Identifier from OPEN used in collision decision |

## Verification

```text
show bgp neighbors 198.51.100.1
! remote AS, local AS, router ID, hold time, capabilities
show ip bgp neighbors 198.51.100.1 | begin Open
```

Lab checks:

1. Capture OPEN on wire; match CLI router-id and ASN.
2. 4-byte ASN to legacy peer: observe AS_TRANS and 4-byte capability.
3. Disable a family locally; confirm capability disappears from OPEN after reset.

## Risks

- Duplicate router-IDs across the AS.
- Reading configured timers instead of negotiated post-OPEN values.
- Expecting a feature without confirming capability intersection.

## Interview framing

“OPEN carries version, AS, Hold Time, BGP Identifier, and capabilities; four-byte ASNs may show AS_TRANS in the two-octet field, and families only work when both OPENs advertise the matching MP capability.”

---
