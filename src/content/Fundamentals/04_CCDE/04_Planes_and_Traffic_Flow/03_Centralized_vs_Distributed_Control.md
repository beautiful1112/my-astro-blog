# Centralized versus distributed control

Control can be **distributed** (classic IGP/BGP on every box), **centralized** (controller computes and pushes), or **hybrid** (underlay distributed, overlay/policy centralized). CCDE cares about **fate**, not fashion.

## Comparison

| | Distributed | Centralized | Hybrid |
|---|---|---|---|
| Fate | Box/peer scoped | Controller cluster is a domain | Split by plane |
| Scale of intent | Harder global policy | Easier global policy | Policy in controller, reachability local |
| Failure | Partial, familiar | Blast radius = controller + southbound | Underlay may survive controller loss |
| Ops | CLI/NETCONF per box | One pane, new skills | Two skill sets |
| Examples | OSPF, iBGP | ACI APIC, some SD-WAN, pure OpenFlow dreams | SD-WAN + IGP underlay; EVPN + assurance controller |

## Design test (must answer in HLD)

Ask: **if the controller dies for 30 minutes, do packets still flow? Can I add a new site? Can I change policy?**

| Outcome during controller loss | Verdict |
|---|---|
| Forwarding continues; change stops | Often acceptable if change RTO is hours |
| New sites cannot onboard | Document as constraint for growth window |
| Forwarding needs continuous heartbeat | You bought a new SPOF—design cluster, path to controllers, DR |
| Nobody can see telemetry | Ops RTO problem even if packets flow |

```text
Good hybrid:
  Underlay IGP/BGP keeps forwarding
  Controller owns overlay policy / ZTP
  Controller cluster site-diverse

Bad coupling:
  Every flow needs controller permission
  Single controller site + same WAN as data
```

## Where centralization earns its keep

- Global segmentation and consistent policy across hundreds of sites
- ZTP and template-driven branch lifecycle
- Fabric assurance and intent verification at scale

Where it does **not**: a 30-router campus where the only “controller” is a spreadsheet and two engineers who live in OSPF.

## Real-world — ISP SD-WAN overlay for enterprise customers

**Context:** Regional ISP sells managed SD-WAN. Underlay is their MPLS/Internet mix; overlay is controller-based.

| R / C / A | Statement |
|---|---|
| R | Customer traffic keeps flowing if vManage/controller cluster is unreachable for 1 hour |
| R | Policy change RTO can be 4 hours |
| C | Controllers hosted in two ISP POPs, not on customer premises |
| A | Customer DIA always reaches both POPs — must test blackhole/partial routing |

```text
Customer CE -- underlay (Internet/MPLS) -- Customer CE
       \                                 /
        \---- DTLS/IPsec overlay -------/
                    |
            Controller cluster (dual POP)
```

**Design:** Hybrid—OMP/overlay state can persist; underlay routing independent. Document “no new templates / no ZTP during controller loss.” Residual: certificate or root-of-trust events that still need controller care.

## Real-world — university campus ACI-style fabric

**Wanted:** One APIC cluster for “simplicity” in a single data hall.

**Failure story:** Hall power event takes compute **and** APIC. Leafs may keep last-known policy, but day-2 changes and some endpoint learning workflows freeze; blame lands on “the network” during registration week.

**Repair pattern:** Controller cluster across halls or rooms with independent power; OOB to APICs; written statement that fabric forwarding survives APIC loss but endpoint policy changes do not. Do not put the only APIC pair on the same UPS string as the spine.

## Placement and HA of the control point

| Control style | HA question |
|---|---|
| Distributed IGP | Dual boxes, dual links, BFD—familiar |
| Centralized | Cluster size, site diversity, southbound path diversity |
| Hybrid | Explicit matrix: which functions die with controller |

## Design checklist

1. Is the controller in the **forwarding** path or only the **change** path?
2. Are controllers site-diverse relative to the fabric they own?
3. Does management reach controllers when the production underlay is sick?
4. What skill set runs day-2—and is that a constraint?

## Risks

- Centralizing for slides while creating a company-wide change freeze SPOF.
- Controllers sharing fate with the only WAN path to sites.
- Hybrid ops: underlay team and overlay team with no shared runbook.
- Assuming “distributed” means no policy SPOF (misconfigured RR/route-server can still centralize fate).

## Interview framing

“I centralize policy when global intent matters, and I keep forwarding state local enough that a controller outage is a change freeze—not a blackhole.”

## Related

- [Control, data, and management planes](01_Control_Data_Management_Planes.md)
- [Overlay, underlay, and fabric](04_Overlay_Underlay_and_Fabric.md)
- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)

---
