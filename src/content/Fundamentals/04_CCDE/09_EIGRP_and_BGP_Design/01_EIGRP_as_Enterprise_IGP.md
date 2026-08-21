# EIGRP as an enterprise IGP

EIGRP remains a strong **Cisco-centric enterprise IGP**, especially for hub-spoke WANs with stub routers and classic campus hierarchies. CCDE grades fit—not nostalgia or dislike.

## Natural strengths

| Strength | Design use |
|---|---|
| Query bounding with stub + summary | WAN spokes |
| Unequal-cost load sharing (if used carefully) | Limited cases |
| Fast DUAL reaction in bounded domains | Campus/WAN |
| Familiarity in many enterprises | Ops constraint |

```text
Spoke (stub) -- Hub
                 |  summary toward spokes
               Core
```

## Awkward fits

| Scenario | Prefer |
|---|---|
| Multi-vendor core | OSPF/IS-IS |
| Internet-scale policy | BGP |
| SP MPLS underlay culture | IS-IS/OSPF |
| Huge flat query domain | Hierarchy first |

## Design must-dos if EIGRP is chosen

1. **Stub** at edges that should not be queried through.
2. **Summaries** at distribution/hubs.
3. Bound **query scope** (see query-bounding note).
4. Passive interfaces on access.
5. Clear redistribute seams (tags) if any.

## Real-world — manufacturing Cisco estate

**Brief:** 120 plants, all Cisco, DMVPN today moving to SD-WAN; plant routers are mid-range; staff debugs EIGRP well; multi-vendor not required.

| R / C / A | Statement |
|---|---|
| R | Plant uplink loss recovers without network-wide queries |
| C | Keep EIGRP through SD-WAN underlay transition year |
| A | “Must move to OSPF because SD-WAN” — false |

**Decision:** Keep EIGRP with stubs/summaries under SD-WAN; revisit IGP only if vendor mix changes. Reject forced OSPF for fashion.

## EIGRP vs OSPF one-liner

| Pick EIGRP when | Pick OSPF when |
|---|---|
| Cisco-heavy + hub-spoke skill | Multi-vendor or OSPF already standard |
| Query tools well understood | Area model already taught |

## Risks

- Flat EIGRP without stub → query storms.
- Unequal-cost surprises.
- Redistribute with BGP/OSPF without tags.

## Interview framing

“EIGRP is a valid enterprise IGP when skill and topology fit—I bound queries with stub and summary, and I switch when multi-vendor or SP patterns dominate.”

## Related

- [Query bounding in design](02_Query_Bounding_in_Design.md)
- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [EIGRP library](../../03_EIGRP/EIGRP_Deep_Dive.md)

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
