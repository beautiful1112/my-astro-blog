# OSPF area design

OSPF areas exist to **bound LSDB size, SPF churn, and operational blast radius**—not to mirror the org chart. Area 0 is the transit backbone for inter-area routes. Every non-backbone area should connect to area 0 (a **virtual link** is a temporary debt, not a topology).

## What you are actually bounding

| Flood / compute | Stays inside | Escapes as |
|---|---|---|
| Router/Network LSAs (type 1/2) | Area | — |
| Summary (type 3/4) | Generated at ABR | Inter-area distance-vector-like |
| External (type 5) | Domain (unless stub) | Unless stub/NSSA tools |

A link flap in a huge single area forces **every** router in that area to run SPF on a large LSDB. That is a failure-domain and CPU story, not just “cleanliness.”

## Sizing — stop using “50 routers”

Size by **LSA count, churn rate, and who gets paged**, not a magic router count.

| Signal | Prefer single area | Prefer multi-area |
|---|---|---|
| Routers | Tens, stable | Hundreds or noisy WAN edges |
| Prefixes / LSAs | Small, summarization impossible anyway | Address plan allows summaries at ABRs |
| Change rate | Rare | Frequent branch/WAN flaps |
| Ops | One team, one view | Need blast-radius walls |

Too many tiny areas: ABR sprawl, messy type-3s, hard troubleshooting. One giant area: SPF and blast radius.

## Real-world — three-campus enterprise (good multi-area)

**Facts:** Campuses A/B/C, dual DC, OSPF, address plan already regional (`10.10/16`, `10.20/16`, `10.30/16`, DC `10.50/16`). WAN is dual hub.

```text
Campus A area 10 --+
Campus B area 20 --+-- ABR pairs -- Area 0 (DC + WAN hubs)
Campus C area 30 --+                    |
                                   Area 40 (optional WAN spokes / stub)
```

**ABR job:** advertise `10.10.0.0/16` etc. into area 0; discard (Null0) for holes; dual ABRs per campus for HA.

**Why not one area?** A WAN flap or campus access event should not recompute SPF on every DC leaf. **Why not one area per floor?** No summary gain; ABR chaos.

## Real-world — 40-router company (keep single area)

Messy historical addressing, no summarizable blocks, two engineers. Multi-area without a renumber project only adds type-3 noise. **Constraint:** stay single area; invest in address plan first; add BFD where RTO needs it; do not pretend areas fix overlapping `/24`s.

## Single vs multi-area

| Single area | Multi-area |
|---|---|
| Simple, fine for small/stable | Scale, fault isolation, summary |
| Any link change can SPF all | Inter-area prefers ABR path (suboptimal possible) |
| Hides addressing mistakes until scale hurts | Needs a summarizable plan |

## Virtual links

Use only to **repair** a temporary backbone disconnect during migration. If your steady-state design needs virtual links, the area map is wrong—move ABRs or renumber the backbone attachment.

## Design checklist

1. Can each area touch area 0 on dual ABRs?
2. Can I summarize at those ABRs with the **current** address plan?
3. Where do ASBRs live (few, deliberate)?
4. Which areas are stub/totally stubby/NSSA and why?
5. What is the blast radius of a WAN adjacency flap?

## Risks

- Area per department with no summary → complexity without isolation.
- Advertising thousands of BGP prefixes into OSPF at the Internet edge ASBR.
- Single ABR per large area → ABR is an SPOF for inter-area.

## Interview framing

“Areas are LSDB/SPF and summary boundaries. I add them when churn or size demands it—and only when the address plan can summarize. I never use one area per org chart box.”

## Related

- [ABR and ASBR placement](02_ABR_and_ASBR_Placement.md)
- [Stub and NSSA as design tools](03_Stub_NSSA_as_Design_Tools.md)
- [Summarization and suboptimal routing](04_Summarization_and_Suboptimal_Routing.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)

---
