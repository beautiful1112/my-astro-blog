# What EIGRP is

**EIGRP** (Enhanced Interior Gateway Routing Protocol) is an **interior gateway** routing protocol historically developed by Cisco. Behavior suitable for multi-vendor implementation is documented as informational **RFC 7868**; in practice most production deployments remain **Cisco IOS / IOS XE** (classic or named mode). EIGRP is an **advanced distance-vector** protocol: routers advertise reachable destinations and metrics to neighbors, and **DUAL** (Diffusing Update Algorithm) selects loop-free paths and coordinates queries when a successor is lost.

EIGRP runs as an **AS-scoped process**: neighbors must agree on the same autonomous-system number configured under the EIGRP process. That AS is a **local identity**, not an Internet public ASN in the BGP sense. Control traffic uses **IP protocol 88** and, on multi-access networks, multicast destination **224.0.0.10** (IPv6: **FF02::A**).

## What EIGRP owns and what it does not

| EIGRP owns | EIGRP does not own |
|---|---|
| Neighbor discovery, Hellos, Hold | Per-packet forwarding in the ASIC/FIB |
| Topology table of known paths via neighbors | A flooded full-network LSDB like OSPF/IS-IS |
| DUAL: successor, FS, Active queries | Guaranteed multi-vendor feature parity |
| Composite metric (classic / wide) | Automatic Internet-scale policy like BGP |
| Stub/summary-influenced advertisement scope | Replacing underlay needs for overlays/VPN cores |

EIGRP supports **destination-based** IPv4/IPv6 unicast routing within an enterprise domain. Named mode organizes configuration under address families; classic mode uses `router eigrp <as>`.

## Mental model

```text
IP proto 88 + RTP
  -> Hellos form neighbors (AS, K-values, subnet, auth)
  -> Updates populate topology table (partial, event-driven)
  -> DUAL picks successor (and FS if feasible)
  -> optional install into RIB/FIB (AD 90/170)
  -> on successor loss without FS: Query domain, wait for Replies
```

“Neighbor up” means the adjacency and RTP channel exist. It does **not** mean every prefix is Passive, installed, or advertised. See [Control plane versus data plane](04_Control_Plane_vs_Data_Plane.md).

## Interactions

| Mechanism | Interaction |
|---|---|
| IGP peers (OSPF/IS-IS) | Compete via admin distance; redistribution needs careful filtering |
| BGP | Often redistribution boundary; EIGRP external AD 170 |
| BFD | Can accelerate neighbor-down detection beyond Hold |
| Stub / summary | Shrink query and update scope—design tools, not cosmetics |

## Configuration patterns (minimal identity)

### Cisco IOS / IOS XE — classic

```text
router eigrp 100
 network 10.0.0.0 0.0.0.255
 network 192.168.1.0
 eigrp router-id 192.0.2.1
```

### Cisco IOS / IOS XE — named mode

```text
router eigrp CAMPUS
 address-family ipv4 unicast autonomous-system 100
  network 10.0.0.0 0.0.0.255
  eigrp router-id 192.0.2.1
 exit-address-family
```

### FRRouting / Junos

FRRouting has **limited or no** classic Cisco EIGRP support suitable for production parity—do not assume `router eigrp` exists like OSPF/BGP. Junos EIGRP is **rare**; treat Cisco as the primary study and ops surface unless your lab explicitly includes another stack.

## Verification

```text
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp
show eigrp address-family ipv4 neighbors
```

Lab checks:

1. Neighbor up with zero topology prefixes beyond connected—explain what is still unproven.
2. Originate one remote prefix; confirm successor in topology and RIB install.
3. Shut the successor link with an FS present; confirm no Query for that prefix.

## Risks

- Calling EIGRP a “hybrid link-state” protocol → wrong flood/query mental model.
- Equating adjacency with Passive, installed routes → silent Active or AD loss.
- Ignoring RFC 7868 vs Cisco feature gaps in multi-vendor talk tracks.

## Interview framing

“EIGRP is an AS-scoped advanced distance-vector IGP using DUAL over IP protocol 88; it exchanges partial updates with neighbors—not a full LSDB—and historically Cisco-centric despite informational RFC 7868.”

---
