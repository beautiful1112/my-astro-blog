# Centralized versus distributed control

Control can be **distributed** (classic IGP/BGP on every box), **centralized** (controller computes and pushes), or **hybrid** (underlay distributed, overlay/policy centralized).

## Comparison

| | Distributed | Centralized | Hybrid |
|---|---|---|---|
| Fate | Box/peer scoped | Controller cluster is a domain | Split by plane |
| Scale of intent | Harder global policy | Easier global policy | Policy in controller, reachability local |
| Failure | Partial, familiar | Blast radius = controller + southbound | Underlay may survive controller loss |
| Ops | CLI/NETCONF per box | One pane, new skills | Two skill sets |
| Examples | OSPF, iBGP | ACI APIC, some SD-WAN, older OpenFlow dreams | SD-WAN + IGP underlay; EVPN + controller assurance |

## Design test

Ask: **if the controller dies for 30 minutes, do packets still flow? Can I add a new site? Can I change policy?**

- If forwarding continues but change stops: often acceptable if RTO for *change* is hours.
- If forwarding depends on continuous controller heartbeat: you bought a new SPOF—design the cluster, WAN to controllers, and disaster recovery.

```text
Good hybrid:
  Underlay IGP/BGP keeps forwarding
  Controller owns overlay policy / ZTP
  Controller cluster site-diverse
```

## Interview framing

“I centralize policy when global intent matters, and I keep forwarding state local enough that a controller outage is a change freeze—not a blackhole.”

---
