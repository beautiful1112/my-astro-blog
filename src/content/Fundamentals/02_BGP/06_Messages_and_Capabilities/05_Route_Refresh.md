# Route Refresh

**Route Refresh** (RFC 2918) lets a speaker ask its peer to resend Adj-RIB-Out for an AFI/SAFI **without** resetting the TCP/BGP session. It enables import-policy reevaluation when the receiver did not retain an unmodified soft-reconfiguration copy of Adj-RIB-In.

**Enhanced Route Refresh** (RFC 7313) adds beginning/end markers that make refresh boundaries explicit and support stale-route handling during refresh, reducing windows where old and new views mix unclearly.

## Soft-reconfig vs refresh

| Approach | Resource cost | Dependency |
|---|---|---|
| Inbound soft reconfiguration | Extra memory for pre-policy copies | Local only |
| Route Refresh | Burst of CPU/UPDATE bandwidth | Peer must negotiate refresh capability |
| Hard reset | Full session teardown | Always works; most disruptive |

Prefer refresh when negotiated. Use soft-reconfig when you must see true pre-policy received routes offline or the peer lacks refresh.

Related: [Soft reconfiguration versus Route Refresh](../07_RIBs_and_Updates/05_Soft_Reconfiguration_vs_Refresh.md), [Capability negotiation](06_Capability_Negotiation.md), [UPDATE](03_UPDATE_Message.md).

## Operational caution

A refresh can cause significant CPU and update load—especially on full-table Internet peers. Change control should estimate affected prefixes and peers before issuing broad refreshes. Refresh is not a cure for export-side mistakes on the peer; it only retransmits what Adj-RIB-Out currently contains.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  ! soft-reconfiguration inbound  # only if refresh unavailable / need pre-policy
!
clear ip bgp 198.51.100.1 soft in
! uses refresh if negotiated
```

### Junos

```text
clear bgp neighbor 198.51.100.1 soft
# or refresh-specific forms depending on release
show bgp neighbor 198.51.100.1 | match Refresh
```

### FRRouting

```text
router bgp 65000
 neighbor 198.51.100.1 remote-as 64496
!
clear bgp 198.51.100.1 soft in
show bgp neighbors 198.51.100.1
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Import policy change | Refresh reapplies new policy to resent routes |
| Enhanced refresh | Markers bound stale cleanup |
| ORF | May interact with which routes are resent/requested |
| GR | Distinct from refresh; do not confuse stale GR paths with refresh stale |

## Verification

```text
show bgp neighbors 198.51.100.1
! Route refresh: advertised/received
show ip bgp neighbors 198.51.100.1 received-routes
clear ip bgp 198.51.100.1 soft in
```

Lab checks:

1. Negotiate refresh; change inbound route-map; soft-in; confirm new LOCAL_PREF without session flap.
2. Disable refresh capability; demonstrate need for soft-reconfig or hard reset.
3. Full-table refresh in lab; measure CPU/time—respect production blast radius.

## Risks

- Refresh storms across many peers simultaneously.
- Assuming soft-in fixes routes the peer never exports.
- Leaving soft-reconfiguration enabled at Internet scale forever → memory pressure.

## Interview framing

“Route Refresh asks a peer to resend Adj-RIB-Out for a family without resetting BGP; it needs capability negotiation, and Enhanced Refresh adds explicit boundaries for safe stale cleanup.”

---
