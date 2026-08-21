# VXLAN EVPN data center

VXLAN is the **data plane**; EVPN is the **control plane**. Underlay is IGP or eBGP with MTU headroom and ECMP. Controllers (ACI and others) wrap the same planes into a product—you still design underlay, overlay, and policy.

```text
Server -- Leaf (VTEP) == VXLAN over ECMP underlay == Leaf (VTEP) -- Server
              ^                         ^
         EVPN MAC/IP               Spines: underlay only
         (BGP RR / eBGP)           (no tenant state)
```

Do not recreate a giant L2 by stretching every VNI to every leaf “for mobility” without need.

## Plane split

| Plane | What lives here |
|---|---|
| Underlay | Loopbacks, ECMP links, BFD, MTU for VXLAN |
| Overlay data | VNI encapsulation, anycast GW forwarding |
| Overlay control | EVPN route types, RT, ESI, multihoming |
| Policy | VRF/VNI mapping, contracts/SGTs/FW insertion |

## Design building blocks

| Block | Guidance |
|---|---|
| VTEP placement | Leaf (common); avoid spine VTEPs unless design needs them |
| Multihoming | ESI / dual-homed LAG; DF election understood |
| Gateway | Distributed anycast GW; minimize hairpin |
| L2 VNI | Per BD/app as needed; bound scope |
| L3 VNI / type-5 | Inter-subnet and DCI-friendly prefixes |
| RR | Paired; capacity for EVPN scale |

## Underlay choices

| Underlay | Pros | Cons |
|---|---|---|
| eBGP (ASN per leaf) | Clean policy, scale | Session count, design discipline |
| IGP (OSPF/IS-IS) | Familiar | Large domain SPF/LSDB care |
| Mixed | Migration reality | Keep next-hop story clear |

MTU: payload + VXLAN overhead must fit every underlay hop—or fragment and suffer.

## Decision table

| Need | Design |
|---|---|
| Multi-tenant DC | VXLAN EVPN + VRF/VNI map |
| Dual-homed servers | ESI multihoming |
| Inter-subnet default | Anycast GW on leaf |
| Between DCs | L3 (type-5 / L3VPN); L2 stretch only if required |
| Ops wants GUI fabric | Controller OK—still document planes |

## Real-world — multi-tenant enterprise DC

**Facts:** 40 leaves, 4 spines, PCI + corporate + DMZ, dual TOR servers.

**Design:**

- eBGP underlay; spines as route reflectors for underlay or pure P
- EVPN: L2 VNIs for app tiers that need adjacency; type-5 elsewhere
- Anycast GW; ESI to server pairs
- DMZ on border leaves with FW service insertion—not every leaf
- No VNI stretched to DR; IP mobility via DNS/L3

**Discarded:** Flood-and-learn VXLAN. One VNI for all “servers.”

## Real-world — brownfield VM farm

**Facts:** Existing L2 aggregation, vMotion across two halls “required” by ops.

**Design:** Challenge the requirement; if kept, **one** bounded VNI between halls with BUM controls and MAC limits; parallel EVPN L3 for new apps; sunset date for stretch. Prefer vSphere/Hypervisor networking redesign over eternal L2 DCI.

## Design checklist

1. Underlay protocol and ECMP failure tested?
2. MTU end-to-end for VXLAN?
3. Which VNIs are L2 vs L3-only?
4. ESI / dual-home story documented?
5. RR/controller HA and upgrade domain defined?
6. Explicit non-goals: no campus VLAN extension into fabric?

## Risks

- Spines holding tenant state accidentally.
- Silent hosts / ARP issues with anycast GW mis-design.
- Controller and DIY CLI fighting for the same fabric.
- Stretching VNIs between sites as a default mobility strategy.

## Interview framing

“DC overlay is EVPN for state and VXLAN for packets on a dumb ECMP underlay. I keep VNIs as small as the app allows and I default to L3 between sites.”

## Related

- [Leaf-spine versus three-tier](01_Leaf_Spine_vs_Three_Tier.md)
- [DCI patterns](03_DCI_Patterns.md)
- [EVPN as unified control](../10_MPLS_VPN_and_EVPN/04_EVPN_as_Unified_Control.md)
- [Overlay, underlay, and fabric](../04_Planes_and_Traffic_Flow/04_Overlay_Underlay_and_Fabric.md)
- [EVPN in BGP library](../../02_BGP/19_EVPN/README.md)

---
