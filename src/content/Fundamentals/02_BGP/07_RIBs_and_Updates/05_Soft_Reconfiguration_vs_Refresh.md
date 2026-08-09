# Soft reconfiguration versus Route Refresh

After an **inbound policy** change, the local speaker must re-evaluate paths learned from a peer. Two main approaches exist:

1. **Inbound soft reconfiguration** — store an extra unmodified copy of received routes and reapply policy locally;
2. **Route Refresh** — ask the peer to resend its Adj-RIB-Out for the AFI/SAFI (RFC 2918), optionally with Enhanced Refresh boundaries (RFC 7313).

Prefer refresh when negotiated. Soft-reconfig consumes substantial **memory** at Internet scale; refresh consumes **UPDATE/CPU bandwidth** during the operation.

## Comparison

| Property | Soft reconfiguration | Route Refresh |
|---|---|---|
| Extra memory | Yes (per peer/family) | No persistent duplicate |
| Peer dependency | None | Requires capability |
| Pre-policy visibility | Yes (typical reason to keep it) | Peer resend is post-export view |
| Blast radius | Memory always | Burst load on demand |
| Hard reset fallback | Works if neither available | Works if neither available |

Related: [Route Refresh](../06_Messages_and_Capabilities/05_Route_Refresh.md), [Three conceptual RIBs](01_Three_Conceptual_RIBs.md), [Capability negotiation](../06_Messages_and_Capabilities/06_Capability_Negotiation.md).

## What you can see after a change

Before changing policy, know whether the platform can show:

- true **pre-policy** Adj-RIB-In (soft-reconfig / specialized ribs);
- only **accepted** post-policy paths;
- or paths **reconstructed** by refresh from the peer’s current export set.

If the peer filters a prefix outbound, neither soft-in nor refresh will make it appear locally.

## Configuration patterns

### Cisco IOS / IOS XE

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 198.51.100.1 activate
  ! neighbor 198.51.100.1 soft-reconfiguration inbound
!
clear ip bgp 198.51.100.1 soft in
! uses refresh if negotiated; else requires soft-reconfig
clear ip bgp 198.51.100.1 in         # refresh path on many releases
```

### Junos

```text
show bgp neighbor 198.51.100.1 | match Refresh
clear bgp neighbor 198.51.100.1 soft
# import policy change then soft clear / wait for refresh
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  neighbor 198.51.100.1 soft-reconfiguration inbound
 exit-address-family
!
clear bgp 198.51.100.1 soft in
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Outbound policy change | Needs soft-out / clear out on **local** Adj-RIB-Out—refresh-in on peer is different |
| Enhanced Refresh | Safer stale cleanup during inbound refresh |
| ORF | Can reduce what is refreshed/sent |
| Max-prefix | Refresh bursts can trip thresholds if not sized |

## Verification

```text
show bgp neighbors 198.51.100.1
! Route refresh capability
show ip bgp neighbors 198.51.100.1 received-routes
show ip bgp neighbors 198.51.100.1 routes
clear ip bgp 198.51.100.1 soft in
```

Lab checks:

1. With refresh only: change inbound LOCAL_PREF; soft-in; session stays Established.
2. Without refresh or soft-reconfig: policy change has no effect until hard reset.
3. Enable soft-reconfig on a lab full table; measure memory—respect production risk.

## Risks

- Leaving soft-reconfiguration on all Internet peers permanently.
- Soft-in storms across many peers after a template push.
- Confusing soft-out (local export rebuild) with peer Route Refresh.

## Interview framing

“Soft-reconfiguration keeps a local pre-policy copy at memory cost; Route Refresh asks the peer to resend Adj-RIB-Out when the capability exists—prefer refresh, and know which CLI view is pre- versus post-policy.”

---
