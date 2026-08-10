# State and tree notation

Multicast state is written as tuples. Reading `(*,G)`, `(S,G)`, and `(S,G,rpt)` correctly is the difference between understanding shared trees, source trees, and SPT switchover.

## Core tuples

| Notation | Meaning | Typical RPF target |
|---|---|---|
| `(*,G)` | Shared state for all sources to group `G` | RP |
| `(S,G)` | Source-specific state for source `S` to `G` | `S` |
| `(S,G,rpt)` | Prune of source `S` from the RP tree after SPT transition | RP (prune toward RP) |

## Tree and interface terms

| Term | Meaning |
|---|---|
| **RPT** | RP-rooted shared tree |
| **SPT** | Source-rooted shortest-path tree |
| **IIF** | Incoming interface expected by RPF |
| **OIF / OIL** | Outgoing interface / list receiving replicas |
| **FHR** | First-hop router beside the source |
| **LHR** | Last-hop router beside receivers |
| **DR** | PIM Designated Router on a multiaccess link |
| **MRIB** | Routing info used for multicast RPF |
| **MFIB** | Programmed forwarding / replication state |

Related: [ASM and SSM](02_ASM_and_SSM.md), [PIM-SM flow](../08_PIM/03_PIM_SM_Complete_Flow.md), [OIL inheritance](../07_RPF_and_Forwarding/07_Forwarding_Rules_and_OIL_Inheritance.md).

## How the tuples interact (ASM SPT switchover)

1. Receiver interest creates `(*,G)` on the LHR; Join goes toward RP.
2. Source traffic creates `(S,G)` along the SPT as routers Join toward `S`.
3. To stop receiving `S` down the shared tree, LHR sends `(S,G,rpt)` prune toward RP.
4. Effective OIL for `(S,G)` = explicit joins + inherited `(*,G)` − rpt prunes − Assert losers − IIF.

```text
effective OIL(S,G) ≈
    joined (S,G) OIFs
  + inherited (*,G) OIFs
  - (S,G,rpt) pruned OIFs
  - Assert-loser OIFs
  - IIF
```

## Configuration patterns

State appears from membership + PIM; you configure the service model that produces it.

### Cisco IOS / IOS XE

```text
! SSM → only (S,G) expected for 232/8
ip pim ssm default
!
! ASM → (*,G) toward RP, then optional (S,G)
ip pim rp-address 192.0.2.100
```

### Junos

```text
set routing-options multicast ssm-groups 232.0.0.0/8
set protocols pim rp static address 192.0.2.100 group-ranges 239.0.0.0/8
```

### FRRouting

```text
ip pim ssm prefix-list SSM
ip pim rp 192.0.2.100 239.0.0.0/8
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Register** | FHR → RP creates source awareness before native `(S,G)` |
| **Assert** | Per-tree LAN forwarder; winner/loser flags on OIF |
| **Negative cache** | `(S,G)` with empty OIL—source seen, no receivers |
| **MBGP** | May change which route feeds MRIB for RPF of `S` or RP |

## Verification

Read flags and RPF, not just the presence of a line:

```text
show ip mroute 239.1.1.1
show ip mroute 192.0.2.10 232.10.10.10
show ip mroute summary
```

Lab checks:

1. ASM before traffic: `(*,G)` only toward RP.
2. After source + SPT switch: `(S,G)` with SPT bit / flags; `(S,G,rpt)` as platform shows.
3. SSM: never require `(*,G)` for `232/8`.
4. Compare software mroute vs hardware MFIB counters.

## Risks

- Treating `(*,G)` OIL as proof that a specific source is wanted (SSM vs ASM confusion).
- Ignoring `(S,G,rpt)` and wondering why shared-tree duplicates persist.
- Equating “route to S exists” with “RPF neighbor selected.”

## Interview framing

“`(*,G)` is the shared tree toward the RP, `(S,G)` is the source tree toward S, and `(S,G,rpt)` prunes that source off the shared tree after SPT switchover.”

---
