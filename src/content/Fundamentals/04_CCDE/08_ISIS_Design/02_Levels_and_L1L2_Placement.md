# IS-IS levels and L1/L2 placement

IS-IS hierarchy uses **Level-1 (area) and Level-2 (backbone)**. Design placement of L1/L2 routers the way you place OSPF ABRs—on purpose, not by accident.

## Roles

| Role | Sees | Job |
|---|---|---|
| L1-only | Its area | Local switching; default to L1/L2 |
| L2-only | Backbone | Inter-area transit |
| L1/L2 | Both | Leak/default between levels |

```text
L1 site/area ---- L1/L2 ---- L2 backbone ---- L1/L2 ---- L1 site
```

## Placement rules

1. Keep **L2 contiguous** (analogous to area 0).
2. Put L1/L2 at **real borders** (POP edge, metro edge, DC border).
3. Avoid accidental L1/L2 everywhere (flat in practice).
4. Control route leaking deliberately (metrics, policies).

## Compared to OSPF language

| OSPF | IS-IS |
|---|---|
| Area | L1 area |
| Backbone area 0 | L2 |
| ABR | L1/L2 router |
| ASBR | Redistributor / other protocol seam |

## Real-world — regional carrier metro

**Brief:** Each city is an L1; national L2; some PEs accidentally L1/L2 and become suboptimal attractors.

| R / C / A | Statement |
|---|---|
| R | City flap contained; national backbone stable |
| C | Dual L1/L2 per city already bought |
| A | “Make all routers L1/L2 for simplicity” — false |

**Decision:** Only border routers L1/L2; internal metro L1; contiguous L2. Reject universal L1/L2.

## Leak and default design

| Pattern | Use |
|---|---|
| Default into L1 | Common for edges |
| Specific leaks | DC prefixes, anycast |
| Wide metric / TE | SP cores with SR |

## Risks

- Discontiguous L2 after renumber.
- Over-leaking → L1 LSDB bloat.
- Level design that fights MPLS/SR topology.

## Interview framing

“I place L1/L2 only at borders, keep L2 contiguous, and treat leaking as an explicit policy—not a default everywhere.”

## Related

- [IS-IS versus OSPF for design](01_ISIS_vs_OSPF_for_Design.md)
- [IS-IS for SP and MPLS](03_ISIS_for_SP_and_MPLS.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)

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
