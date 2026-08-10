# Lab: Interface Summarization and Null0

## Objective

Configure an interface summary on an aggregation router, verify the **Null0** discard route (AD 5), prove Core sees the aggregate instead of leaf specifics, and show correct discard behavior when components vanish.

## Prerequisites / skills practiced

- Interface `ip summary-address eigrp` (classic) and named `af-interface` summary
- Null0 summary route purpose (loop prevention)
- Query-scope reduction via summarization
- Contrast with legacy auto-summary

## Topology and addressing

```text
Leaf-1 10.1.1.0/24 ──┐
Leaf-2 10.1.2.0/24 ──┼── Agg ──────── Core
Leaf-3 10.1.3.0/24 ──┘     summarizes
                           10.1.0.0/16
                           toward Core

Agg–Leaf-1: 192.0.2.0/24     (.1=Agg, .10=L1)  L1 Lo or LAN 10.1.1.1/24
Agg–Leaf-2: 198.51.100.0/24  (.1=Agg, .20=L2)  L2: 10.1.2.1/24
Agg–Leaf-3: 203.0.113.0/24   (.1=Agg, .30=L3)  L3: 10.1.3.1/24
Agg–Core:   10.0.0.0/24      (.1=Agg, .2=Core)
```

Simpler three-router variant: put `10.1.1.0/24`, `10.1.2.0/24`, `10.1.3.0/24` as loopbacks/SVIs on Agg itself and summarize on the Agg–Core interface only.

## Configuration steps

1. EIGRP AS 100 on Leafs, Agg, Core; advertise leaf prefixes and the Agg–Core link; `no auto-summary` everywhere.
2. On Agg interface facing Core (classic):

```text
interface GigabitEthernet0/0
 ip address 10.0.0.1 255.255.255.0
 ip summary-address eigrp 100 10.1.0.0 255.255.0.0
```

Named mode sketch:

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  af-interface GigabitEthernet0/0
   summary-address 10.1.0.0/16
  exit-af-interface
```

3. On Agg verify Null0:

```text
show ip route 10.1.0.0
show ip eigrp topology 10.1.0.0/16
```

4. On Core: confirm `10.1.0.0/16` present and **no** (or fewer) `10.1.x.0/24` specifics from Agg.
5. Ping `10.1.1.1` from Core — should succeed via Agg longest-match to component.
6. Shut all leaf component interfaces/networks on Agg’s southbound side. Traffic to `10.1.1.1` from Core hits Agg **Null0** (discard), not a loop back to Core.

## Expected show-output checkpoints

| Check | Expected |
|-------|----------|
| Agg RIB | `D 10.1.0.0/16 is a summary, Null0`, AD **5** |
| Core RIB | Summary via Agg; leaf /24s suppressed on that interface |
| Topology on Agg | Summary entry; components still local/south |
| After all components down | Summary may be withdrawn or Null0 remains per platform rules—document; packets must not loop to Core |

Also: `show ip route 10.1.1.1` on Agg with components up → longest match to leaf, not Null0.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| Wrong mask (e.g. /8) overlapping other domains | Attraction / blackhole outside lab intent |
| Remove summary but Core still has traffic for aggregate | Depends on remaining specifics; possible suboptimal or loss |
| Enable `auto-summary` (lab only) | Classful surprises—compare to explicit Null0 summary |
| Leak-map missing needed specific | Core cannot prefer a critical /24 (optional advanced) |

## Verification checklist

- [ ] Null0 summary AD 5 documented on Agg
- [ ] Core prefix list before/after summary
- [ ] Discard test with all components down (no Core↔Agg loop)
- [ ] Note: withdrawing one leaf /24 should not Query past Core for every remote

## Write-up / interview reflection

1. Why is summary AD **5** critical relative to EIGRP internal 90?
2. What happens if an aggregate is advertised **without** a local Null0 discard?
3. How does summarization shrink query scope when one leaf /24 is withdrawn?
4. When would you add a leak-map for a single /24 toward Core?

## Related

- [Why summarize in EIGRP](../10_Summarization/01_Why_Summarize_in_EIGRP.md)
- [Interface summarization](../10_Summarization/03_Interface_Summarization.md)
- [Null0 discard route](../10_Summarization/04_Null0_Discard_Route.md)
- [Summarization and query reduction](../10_Summarization/07_Summarization_and_Query_Reduction.md)

---
