# Summarizable address plans

A summarizable plan assigns **contiguous blocks to hierarchy tiles** so ABRs/L1L2/BGP edges can advertise aggregates without lying about topology.

## Recipe

1. List hierarchy tiles (region, site, building, VRF).
2. Size blocks from growth + dual-stack needs.
3. Assign contiguous space per tile.
4. Document aggregate at each border.
5. Reserve space for cloud, NAT, infrastructure.

```text
10.0.0.0/12 org example (illustrative)
  10.0.0.0/14  Region A
    10.0.0.0/16 Site A1
      10.0.0.0/20 Building 1
  10.4.0.0/14  Region B
IPv6: allocate /48 per site from org /32 (example habit)
```

Exact sizes are org-specific; the **contiguity rule** is not optional if you want summaries.

## Anti-patterns

| Anti-pattern | Result |
|---|---|
| Next ticket gets next /24 | Non-summarizable spaghetti |
| Pretty VLAN = address | Breaks hierarchy |
| Overlap “temporary” | Permanent NAT tax |
| One /8 flat | No border aggregates |

## Real-world — hospital group expansion

**Brief:** New clinics monthly; old plan used leftover scraps; OSPF summaries constantly wrong; FW rules chaotic.

| R / C / A | Statement |
|---|---|
| R | New clinic aggregates in one line at regional ABR |
| C | Old campuses keep legacy 18 months |
| A | “IPv6 abundance means no planning” — false |

**Decision:** New clinic block contiguous per region; legacy behind explicit exceptions; dual-stack plan mirrors hierarchy. Reject scrap allocation.

## Summary hygiene

| Practice | Why |
|---|---|
| Discard/null for aggregates | Loop prevention |
| IPAM source of truth | Stops drift |
| Align VRF spaces | Clear policy |
| Review annually | Growth & cloud |

## Risks

- Summarizing non-owned space.
- Exhausting a tile without split plan.
- Different v4 vs v6 hierarchy shapes without reason.

## Interview framing

“I build address plans for summarizable borders first—contiguity per hierarchy tile—so routing scale and policy stay cheap.”

## Related

- [Addressing as architecture](01_Addressing_as_Architecture.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)
- [OSPF summarization and suboptimal routing](../07_OSPF_Design/04_Summarization_and_Suboptimal_Routing.md)

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
