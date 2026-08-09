# Advertisement, withdrawal, and replacement

A peer removes or changes reachability by:

1. **Explicit withdrawal** — WITHDRAWN / `MP_UNREACH_NLRI` lists the NLRI;
2. **Implicit replacement** — advertising the same NLRI with new path attributes;
3. **Session teardown** — implicitly removes all routes learned from that peer unless GR/LLGR retention applies.

BGP sends **incremental** changes, not periodic full-table refreshes. A route that remains unchanged can stay installed indefinitely with no repeated UPDATE.

## Distinguishing disappearance causes

| Observation | Likely cause |
|---|---|
| UPDATE with withdraw for NLRI | Explicit withdrawal |
| UPDATE with same NLRI, new attrs | Replacement |
| Session Idle, all prefixes gone | Session reset / NOTIFICATION / transport |
| Session up, subset missing after policy change | Import/export reevaluation / refresh |
| Path invalid / inaccessible | Next-hop resolution loss |
| Quiet loss, session up | Treat-as-withdraw / local validation (RPKI) |

Related: [UPDATE message](../06_Messages_and_Capabilities/03_UPDATE_Message.md), [Treat-as-withdraw](../06_Messages_and_Capabilities/07_Error_Handling_Treat_as_Withdraw.md), [Next-hop resolution](04_Next_Hop_Resolution.md).

## End-of-RIB and convergence tooling

Some deployments use End-of-RIB markers (graceful restart machinery) and refresh boundaries to know when a peer has finished a batch of advertisements. Do not confuse “no UPDATE for a while” with “peer has no more routes”—idle keepalives are normal after convergence.

## Configuration patterns (force advertise / withdraw)

### Cisco IOS / IOS XE

```text
router bgp 65000
 address-family ipv4 unicast
  network 203.0.113.0 mask 255.255.255.0
 ! remove network statement or route-map deny out to withdraw
  neighbor 198.51.100.1 route-map WITHDRAW-ME out
```

### Junos

```text
set policy-options policy-statement EXPORT term deny-prefix from route-filter 203.0.113.0/24 exact
set policy-options policy-statement EXPORT term deny-prefix then reject
set protocols bgp group EXT export EXPORT
```

### FRRouting

```text
router bgp 65000
 address-family ipv4 unicast
  no network 203.0.113.0/24
  neighbor 198.51.100.1 route-map EXPORT out
 exit-address-family
```

## Interactions

| Mechanism | Interaction |
|---|---|
| Soft clear out | Rebuilds Adj-RIB-Out and may send withdraw/replace sets |
| Aggregation `summary-only` | More-specifics suppressed (withdrawn from peers) when aggregate forms |
| GR | Session reset may *not* immediately withdraw from forwarding |
| Route Refresh | Peer resends current Adj-RIB-Out; absent prefixes are effectively gone |

## Verification

```text
show ip bgp neighbors 198.51.100.1 advertised-routes
show ip bgp 203.0.113.0/24
clear ip bgp 198.51.100.1 soft out
# capture UPDATEs during change windows in lab
```

Lab checks:

1. Change MED only → replacement UPDATE, not long withdraw gap (ideally).
2. Export deny → explicit withdraw toward peer.
3. Hard reset vs GR-enabled reset → compare control-plane withdrawal timing.

## Risks

- Assuming routes time out like OSPF LSAs without updates.
- Blaming “withdrawal bugs” when next-hop invalidation made paths unusable.
- Mass soft-out on full tables during change windows → unnecessary churn.

## Interview framing

“BGP is incremental: reachability changes by withdraw, by replacement UPDATE for the same NLRI, or by session loss; unchanged routes need not be re-advertised periodically.”

---
