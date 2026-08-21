# L3VPN versus L2VPN

Default to **L3VPN** unless the requirement is true L2 adjacency. L2VPN / VPLS / EVPN-ELAN stretch a broadcast domain; that is a product only when the application or migration genuinely needs it.

```text
L3VPN:  CE(router) -- PE(VRF) ==== MPLS/SR ==== PE(VRF) -- CE(router)
        IP handoff; failure domain is routing / VRF

L2VPN:  CE(switch) -- PE(AC)  ==== MPLS/SR/VXLAN ==== PE(AC) -- CE(switch)
        VLAN/Ethernet handoff; flood/MAC/BUM must be designed
```

EVPN can deliver both L2 and L3 services with better control than classic VPLS, but **L2 fate still exists** if you stretch the broadcast domain.

## Comparison

| Dimension | L3VPN | L2VPN / VPLS / EVPN-ELAN |
|---|---|---|
| CE–PE | Routing (eBGP/OSPF/static) | Bridging or VLAN handoff |
| Customer want | “Just give me IP” | “My VLAN/LAN anywhere” |
| Failure domain | IP / VRF | L2 may stretch across sites |
| Scale | Excellent with RT/RD | Flood, MAC, BUM must be bounded |
| Overlap | Natural with VRFs | Possible; MAC/IP clashes hurt |
| Multicast | Per-VRF / MDT design | BUM replication design |
| Ops | Familiar IP troubleshooting | Bridging + PW/EVPN state |

## When L2 is actually required

| Legitimate need | Still bound it |
|---|---|
| Cluster heartbeat / non-IP L2 app | Small VNI/VLAN, dual sites max |
| Migration “same subnet” temporarily | Time-box; exit to L3 |
| Transparent LAN service for a customer | Contracted SLA on MAC/BUM scale |
| DCI for live migration | Prefer L3 + app mobility; L2 only if proven |

“We might need mobility someday” is **not** a requirement.

## Decision table

| Requirement | Prefer |
|---|---|
| IP connectivity, overlapping RFC1918 | L3VPN |
| Any-to-any / hub-spoke / extranet | L3VPN + RT design |
| True Ethernet LAN extension | EVPN-ELAN (prefer over classic VPLS) |
| DC fabric inside one site | VXLAN EVPN (L2/L3 as needed) |
| Multi-site default | L3 between sites; no stretch |

## Real-world — bank WAN (L3VPN)

**Facts:** 400 branches, overlapping partner VRFs, PCI segmentation, dual PE.

**Design:** L3VPN with RT for any-to-any employee VRF and hub-spoke ATM VRF; Internet in separate edge VRF. CE–PE eBGP with filters. No branch VLAN stretch.

**Why L2 fails:** Broadcast domain across 400 sites is an outage factory; PCI scope explodes.

## Real-world — factory OT migration (bounded L2)

**Facts:** Old PLC subnet must move from Plant A to Plant B over one weekend; apps use broadcast discovery; permanent design should be L3.

**Design:** Temporary EVPN-ELINE/ELAN between two PEs for that VLAN only; rate-limit BUM; sunset ticket with date. Parallel L3VPN for new engineering traffic.

**Discarded:** Permanent VPLS “because OT is L2”—becomes shared fate forever.

## Design checklist

1. Is the requirement IP reachability or Ethernet adjacency?
2. What is the maximum blast radius of BUM / MAC moves?
3. RT/RD (L3) or EVI/VNI + ESI (L2) topology matches the service graph?
4. CE handoff: routed or bridged—and who owns Spanning Tree if any?
5. Exit criteria if L2 is temporary?

## Risks

- Selling L2 because the customer asked for “LAN” and meant IP.
- Classic VPLS without EVPN MAC control at scale.
- Stretching every VLAN between DCs “for vMotion.”
- Mixing Internet and customer L2 on the same PE without clear AC isolation.

## Interview framing

“I sell L3VPN by default. I sell L2/EVPN-ELAN only when the application truly needs a broadcast domain, and I bound that domain in space and time.”

## Related

- [Why MPLS exists](01_Why_MPLS_Exists.md)
- [VPN topologies](03_VPN_Topologies.md)
- [EVPN as unified control](04_EVPN_as_Unified_Control.md)
- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)
- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)

---
