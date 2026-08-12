# STP and why to minimize L2

Spanning Tree is a **loop-prevention protocol**, not a load-balancing fabric. Large STP domains are slow to converge, hard to reason about, and famous for company-wide outages.

## Design stance

1. Prefer **L3** at the earliest point that applications allow.
2. Where L2 remains, keep it **small** and use **multichassis LAG** so STP sees a loop-free triangle, not a blocking diamond.
3. Do not mix STP modes and extensions casually across a merged company.

```text
Worse:  Access -- Dist -- Core -- Dist -- Access   (one STP for campus)
Better: Access L2 local; L3 from distribution/access up
```

## When STP still appears

Brownfield campuses, some OT/IoT rings, and vendor bundles that still assume a VLAN per app. Your job is **containment**: MST/RPVST scope, root placement, BPDU guard, and no VLAN 1 as a production transit.

## Load balancing

STP blocks links. If you need both uplinks forwarding, that is **L3 ECMP** or **MLAG/vPC**, not “tune STP costs until it feels like ECMP.”

## Interview framing

“STP is a safety net for a small L2 island. I do not build a campus or DC out of a large spanning-tree domain and then call it HA.”

---
