# When to choose EIGRP

EIGRP remains excellent inside Cisco-centric campuses and WANs. It is not the default Internet or multi-vendor core protocol.

## Decision table

| Requirement | Prefer EIGRP | Prefer other |
|---|---|---|
| All-Cisco enterprise LAN/WAN | **Yes** | — |
| Fast DUAL convergence with FS | **Yes** | OSPF also fine |
| Unequal-cost load balancing (variance) | **Yes** | OSPF ECMP only equal-cost |
| Multi-vendor routers | No | OSPF / IS-IS |
| Internet edge / policy-heavy peering | No | BGP |
| MPLS PE-CE multi-vendor | No | BGP |
| Massive ISP scale TE | No | IS-IS/OSPF + BGP |
| Simple hub-spoke DMVPN Cisco | **Yes** | BGP overlay also common |
| Strict open standards mandate | No | OSPF/IS-IS/BGP |

## Strengths

- DUAL feasible successors → often local repair without Active.
- Easy WAN stub + summary model.
- Unequal-cost paths with variance + FC.
- Named mode AF clarity (v4/v6).

## Weaknesses

- Historically Cisco-proprietary (still ecosystem-skewed).
- Query/SIA operational hazard if designed flat.
- Weaker TE/policy vocabulary than BGP.
- Wide-metric / classic migration sharp edges.

## Architecture blends

| Layer | Common choice |
|---|---|
| Access/distribution campus | EIGRP or OSPF |
| WAN overlay | EIGRP or BGP |
| DC fabric | BGP (EVPN) / IGP underlay |
| Internet | BGP only |

Running EIGRP under BGP edge is normal; redistributing carefully at the boundary.

## Interview framing

“Choose EIGRP for Cisco enterprise LAN/WAN needing unequal-cost and stub WAN scale; choose OSPF/IS-IS for multi-vendor IGP and BGP for policy domains.”

## Migration notes

Moving from EIGRP to OSPF/BGP (or the reverse) is a redistribution and AD project first. Keep tags, avoid mutual redistribution at every spoke, and freeze variance assumptions during cutover.

## Red flags against EIGRP

- Procurement requires multi-vendor CE.
- Policy must express customer communities end-to-end.
- Underlay is SP-managed and only BGP is allowed on CE.
- Team has no EIGRP operational baselines (SIA literacy).

## Lab decision exercise

Build the same hub-spoke in EIGRP and BGP. Compare: stub/summary effort vs prefix-lists/communities; unequal-cost needs; vendor mix. Pick deliberately—not by habit.

## Related

- [Query Domain Architecture](02_Query_Domain_Architecture.md)
- [EIGRP as PE-CE](05_EIGRP_as_PE_CE.md)
- [Wide Metrics Migration](04_Wide_Metrics_Migration.md)

---
