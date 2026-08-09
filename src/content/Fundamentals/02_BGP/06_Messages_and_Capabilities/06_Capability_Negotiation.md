# BGP capabilities

**Capabilities** are advertised in OPEN optional parameters (RFC 5492). They enable extensions without breaking base BGP-4. Always inspect **negotiated**—not merely configured—capabilities.

## Important examples

| Capability | Purpose |
|---|---|
| Multiprotocol extensions | Per-AFI/SAFI NLRI (RFC 4760) |
| Route Refresh / Enhanced Refresh | Soft inbound re-request (RFC 2918 / 7313) |
| Four-octet ASN | 32-bit ASNs (RFC 6793) |
| Graceful Restart / LLGR | Restart retention behaviors |
| ADD-PATH | Multiple paths per NLRI send/receive modes |
| Extended Message | Larger BGP messages (RFC 8654) |
| BGP Roles | Relationship signaling / leak detection aid (RFC 9234) |

Capabilities can be **directional** where defined. ADD-PATH, for example, can be send, receive, or both, often per AFI/SAFI.

Related: [OPEN message](02_OPEN_Message.md), [OPEN negotiation](../05_FSM_and_Timers/02_OPEN_Negotiation.md), [Route Refresh](05_Route_Refresh.md).

## Negotiation rules of thumb

1. Each speaker advertises what it supports and is configured to offer.
2. Intersection (and direction rules) determine what actually runs.
3. Unknown capabilities are generally ignored (do not reset solely for unknowns).
4. Session Established ≠ every configured family active.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  neighbor 198.51.100.1 additional-paths receive
  neighbor 198.51.100.1 additional-paths send
 exit-address-family
```

### Junos

```text
set protocols bgp group EXT family inet unicast
set protocols bgp group EXT family inet6 unicast
set protocols bgp group EXT neighbor 198.51.100.1
set protocols bgp group EXT graceful-restart
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  neighbor 198.51.100.1 addpath-tx-all-paths
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Address-family activation | Local activate must meet peer capability |
| Soft clear | Uses refresh capability when present |
| 4-byte AS | Interop with AS_TRANS when peer lacks capability |
| RR / ADD-PATH | Path diversity depends on send/receive modes |

## Verification

```text
show bgp neighbors 198.51.100.1
! Neighbor capabilities / Negotiated capabilities
show ip bgp neighbors 198.51.100.1 | begin Neighbor capabilities
```

Lab checks:

1. Enable IPv6 only locally → not negotiated → no IPv6 NLRI.
2. Refresh capability present ↔ `soft in` does not reset TCP.
3. ADD-PATH send-only vs receive-only: confirm path diversity direction.

## Risks

- Documenting “we run GR” from templates without negotiated confirmation.
- Turning on every capability “just in case” → larger attack/compat surface.
- Per-family capability mismatches that leave one service dark on a green session.

## Interview framing

“Capabilities are OPEN optional features negotiated per session—and often per AFI/SAFI; configured features that the peer did not advertise simply do not operate even if BGP is Established.”

---
