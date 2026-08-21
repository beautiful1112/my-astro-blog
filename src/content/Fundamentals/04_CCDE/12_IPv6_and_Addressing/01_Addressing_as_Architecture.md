# Addressing as architecture

Addressing is not bookkeeping. A good plan enables **summarization, segmentation, multi-region growth, and clearer troubleshooting**. A bad plan forces flat routing forever.

## Architectural jobs of addresses

| Job | How addressing helps |
|---|---|
| Hierarchy | Contiguous blocks per site/module |
| Failure domains | Align prefixes to domains |
| Security | Predictable ranges for policy |
| Dual-stack | Parallel IPv4/IPv6 intent |
| Cloud | Avoid overlap; plan NAT vs renumber |
| Automation | Stable, documented allocations |

```text
Org /16 or IPv6 /32-ish
  Region
    Site / Campus
      Building / VRF
        Closet / VLAN
```

## Principles

1. **Plan before** protocol debates when possible.
2. Prefer **summarizable** hierarchy over pretty sequential history.
3. Document **purposeful** space (users, infra, NAT pools, cloud).
4. Leave **growth headroom** without inventing one giant flat sea.
5. Treat overlaps as first-class migration risk.

## Real-world — merger of two retailers

**Brief:** Both use 10.0.0.0/8 randomly; need shared services in 9 months; cloud apps already overlapping.

| R / C / A | Statement |
|---|---|
| R | Shared inventory reachable without hairpin chaos forever |
| C | Cannot renumber POS lanes quickly |
| A | “NAT everything forever” is free — false (ops + broken apps) |

**Decision:** New summarizable space for shared services; timed renumber waves for sites; selective NAT as bridge. Reject permanent double-NAT mesh as architecture.

## IPv6 note

IPv6 abundance is not an excuse for chaos—**hierarchy still wins**. See dual-stack and summarizable plan notes.

## Risks

- Addressing by install date / ticket order.
- Hiding overlaps with layers of NAT indefinitely.
- No IPAM / source of truth.

## Interview framing

“I treat addressing as architecture: hierarchy for summaries and policy first, then protocols—and I plan overlaps as migration risk.”

## Related

- [Summarizable address plans](04_Summarizable_Address_Plans.md)
- [Dual-stack design](03_Dual_Stack_Design.md)
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
## Micro-scenario (second pass)

**Brief:** Constraints tighten mid-project (budget cut, skill loss, or regulator letter).

| R / C / A | Statement |
|---|---|
| R | Preserve the original outcome metric |
| C | New hard limit appears |
| A | “Keep the old HLD unchanged” — usually false |

**Move:** Re-open only the decisions that the new constraint touches; keep invariants that still fit. Document what you demote from requirement to wish.

## One-page defense skeleton

```text
Outcome (R#)
Choice (one sentence)
Loser (one sentence)
Spend (cost/complexity/suboptimal)
Residual risk
Proof (test/KPI)
```

---
