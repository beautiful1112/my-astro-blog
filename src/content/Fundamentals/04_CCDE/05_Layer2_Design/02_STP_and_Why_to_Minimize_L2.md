# STP and why to minimize L2

Spanning Tree protects loops by **blocking**; it does not make large L2 domains safe. CCDE default: shrink L2 to the smallest closet or leaf pair that real applications require.

## What STP buys and costs

| Buys | Costs |
|---|---|
| Loop prevention on redundant L2 | Slow or surprising reconvergence |
| Familiar VLAN model | Large blast radius on BPDUs/storms |
| Works with dumb endpoints | Underutilized links (classic STP) |

```text
Big L2 domain + "we have STP"  ≠  HA design
Big L2 domain + storm          =  wide outage
```

## Why minimize

1. Broadcast/unknown unicast containment.
2. Faster, clearer failure domains (L3 ECMP).
3. Fewer STP topology surprises across buildings.
4. Cleaner security segmentation.
5. Better use of bandwidth (routed ECMP / fabric).

## When L2 remains justified

| Case | Bound it by |
|---|---|
| Cluster heartbeat / legacy app | Single pair/rack, not campus |
| Migration brownfield | Temporary, time-boxed |
| Wireless controller adjacency quirks | Documented exception |

## Real-world — hospital campus after STP meltdown

**Brief:** Root bridge flap black-holed three buildings; clinical scanners share user VLANs; leadership wants “more redundant links.”

| R / C / A | Statement |
|---|---|
| R | Clinical devices recover in <60 s for distribution uplink loss |
| C | Some biomedical gear is L2-sticky for 18 months |
| A | “Add more trunks and tune STP” fixes root cause — false |

**Decision:** L3 between buildings immediately; keep L2 only inside floor closets; isolate biomedical VLANs. Reject campus-wide VLAN with MST “optimization” as the strategy.

## Design habits

| Habit | Detail |
|---|---|
| BPDU Guard / Root Guard | On access edges |
| Storm control | Baseline, not hero |
| Prefer L3 access or tiny L2 | Default pattern |
| vPC/MLAG | Still not an excuse to stretch VLANs across DCs |

## Risks

- Treating MST/RPVST tuning as architecture.
- Stretching VLANs “for vMotion” without domain math.
- Disabling STP protections for “convenience.”

## Interview framing

“I minimize L2 because STP bounds loops, not blast radius—I route between buildings and keep L2 exceptions tiny and time-boxed.”

## Related

- [L2 failure domains](01_L2_Failure_Domains.md)
- [L2 versus L3 access](04_L2_vs_L3_Access.md)
- [VLAN and broadcast design](05_VLAN_and_Broadcast_Design.md)

## Decision checklist

1. Which numbered requirement does this choice serve?
2. Which constraint forbids the popular alternative?
3. What failure domain did we shrink or accept?
4. What is the migration/rollback story?
5. How will ops prove it on a Tuesday night?
## Failure modes to narrate

| Fault | Bad design reaction | Good design reaction |
|---|---|---|
| Link/node loss | Timers only; no alternate | Diverse path + detect + repair |
| Control-plane churn | Flood detail everywhere | Summary/stub/level + bounded domain |
| Human change error | No canary / huge blast | Module seams + staged change |
| Dependency outage | Silent shared fate | Named fate-share + residual risk |
## What to discard

Discard slogan-driven picks (“modern,” “vendor preferred,” “more redundant”) that cannot cite R/C/A. Discard designs that cannot state what still works when one module fails.

## How you prove it

- Whiteboard the module borders and plane roles in <3 minutes
- Pull a link/node in a lab or maintenance window and compare to RTO
- Show the discarded option and the requirement that killed it

---
