# Design RFCs and architecture docs

Use RFCs as **behavior constraints**, not as HLD templates.

| Area | Starting points |
|---|---|
| BGP | RFC 4271, 4364 (L3VPN), 7432 (EVPN) |
| OSPF | RFC 2328, 5340 |
| IS-IS | RFC 1195, 5308+ |
| EIGRP | RFC 7868 (informational) |
| Multicast | RFC 4601 PIM-SM, 4607 SSM |
| DiffServ | RFC 2474/2475 |
| BFD | RFC 5880 |
| YANG/NETCONF | RFC 6241, 7950 |

Vendor architecture: Cisco enterprise campus, SD-WAN, EVPN-VXLAN, and SDA design guides—read for **patterns**, then run them through *your* R/C/A. Do not paste a CVD as an exam answer when the scenario forbids the constraint set it assumes.

## When to read what

| Document class | Read when… | Skip / defer when… |
|---|---|---|
| Core protocol RFC (BGP, OSPF, IS-IS) | You must defend adjacency, scale, or policy behavior | You only need a campus L2 containment story |
| L3VPN / EVPN RFCs (4364, 7432) | RT topology, PE/P roles, or stretch vs L3 debates | Scenario is pure SD-WAN over DIA with no label core |
| EIGRP RFC 7868 | Query/stub/summary design arguments | Enterprise already standardized on OSPF/IS-IS only |
| Multicast RFCs | ASM vs SSM, RP placement, RPF failure modes | No multicast requirement in the scenario |
| DiffServ RFCs | End-to-end class model vs “priority everywhere” | QoS is not in scope; do not invent it |
| BFD RFC | Sub-second detection vs timer-only HA claims | Timers already meet RTO; BFD is optional polish |
| YANG/NETCONF | Automation / SoT / controller design | Pure underlay HA with no day-2 story required |
| CVD / vendor architecture guide | Pattern vocabulary and validated topologies | Constraints conflict (budget, skill, sovereignty) |

## Suggested reading order for CCDE

1. **Scenario first** — extract R/C/A; list which behaviors you must prove.
2. **One RFC section** that constrains that behavior (e.g., VPN route target idea, not the whole PDF).
3. **One vendor pattern** that implements it under common constraints.
4. **Discard** anything the scenario’s constraints forbid—even if the CVD loves it.

## Architecture docs — constraint-aware use

| Source | Good use | Bad use |
|---|---|---|
| Campus / SDA design guide | Hierarchy, L2 bounds, services placement | Copy fabric for a plant with OT air-gap rules |
| SD-WAN design guide | TLOC diversity, hub fate, DIA/SaaS | Assume controller is free HA for OT forwarding |
| EVPN-VXLAN CVD | Leaf-spine, L3 DCI default | Stretch every VLAN because the guide shows a lab stretch |
| SP MPLS/VPN material | PE/P/RR scale story | Force MPLS on a two-site IPsec need |

## Proof you “read” it

- Name one **MUST** behavior the RFC forces (e.g., P need not carry VPN routes).
- Name one **assumption** the CVD makes that your scenario lacks.
- Write one **discarded** option that only exists because a guide looked pretty.

## Mini map — CCDE claim → first RFC stop

| Design claim you want to defend | Open first |
|---|---|
| “Core stays free of tenant routes” | RFC 4364 (L3VPN model) |
| “EVPN is the control plane for this fabric/service” | RFC 7432 |
| “BFD meets detection budget independent of IGP timers” | RFC 5880 |
| “SSM avoids shared-tree/RP dependency for this feed” | RFC 4607 |
| “DiffServ classes are end-to-end contracts, not hop cosmetics” | RFC 2474/2475 |
| “NETCONF/YANG is the config contract for automation” | RFC 6241, 7950 |

Keep sessions short: one claim, one RFC section, one scenario sentence. Full-RFC binge rarely survives Practical time pressure.

## Related

- [Official CCDE blueprint](01_Official_CCDE_Blueprint.md)
- [Further reading](04_Further_Reading.md)
- [Technology selection card](../21_Memorization/03_Technology_Selection_Card.md)

---
