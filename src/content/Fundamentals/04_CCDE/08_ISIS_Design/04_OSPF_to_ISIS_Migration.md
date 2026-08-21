# OSPF to IS-IS migration

Migrating IGP is a **control-plane transplant**. Success comes from seams, ships-in-the-night, and rollback—not from a weekend “cut everyone over.”

## Why migrate

| Driver | Valid? |
|---|---|
| Multi-vendor / SP alignment | Often |
| SR/TLV roadmap | Sometimes |
| “IS-IS is cooler” | Not alone |
| OSPF scale pain | Fix hierarchy first; migrate second |

## Patterns

| Pattern | Description | Risk |
|---|---|---|
| Ships-in-the-night | Both IGPs; preferential distance | Temporary complexity |
| Island growth | Convert region by region | Border redistribution |
| Parallel underlay | New core first | Cost |
| Big bang | One window | High |

```text
Phase 0: Address + level/area target design
Phase 1: Core IS-IS, OSPF remains edges
Phase 2: Move borders; distance/preference
Phase 3: Remove OSPF; verify VPN/TE
```

## Real-world — wholesale carrier consolidation

**Brief:** Acquired ISP runs OSPF; parent runs IS-IS+SR; need single underlay in 18 months; MPLS VPNs must not bounce.

| R / C / A | Statement |
|---|---|
| R | VPN prefixes stable; no >2 min control hit for priority VRFs |
| C | Dual NOC tools during overlap; cannot renumber SIDs carelessly |
| A | “Redistribute both ways forever” is fine — false |

**Decision:** Ships-in-the-night with one-way preference, regional cutovers, BGP VPN untouched as much as possible. Reject permanent mutual redistribute.

## Guardrails

1. Keep BGP overlays stable while IGP moves.
2. Prefer **one redistribution direction** with tags.
3. Track FID/SID and label continuity.
4. Overload bit / max-metric for graceful insert/remove.
5. Document rollback per phase.

## Risks

- Routing loops at dual-IGP borders.
- MTU/label MTU surprises.
- Ops confusion during overlap (which IGP “owns” a prefix).

## Interview framing

“I migrate OSPF to IS-IS in phased ships-in-the-night with a target hierarchy—never permanent mutual redistribution as the architecture.”

## Related

- [IS-IS versus OSPF for design](01_ISIS_vs_OSPF_for_Design.md)
- [Redistribution as a design smell](../06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)
- [Implementation and migration plans](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)

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
