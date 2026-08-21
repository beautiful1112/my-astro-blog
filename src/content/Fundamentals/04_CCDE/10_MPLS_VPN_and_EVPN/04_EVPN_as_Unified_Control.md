# EVPN as unified control

EVPN (MP-BGP) is a **control plane** for MAC/IP reachability. It pairs with VXLAN in the DC and with MPLS (or PBB) in the WAN. It replaces flood-and-learn as the primary teacher of who is where.

```text
Planes still split:

  Management   controllers / assurance (optional)
  Control      BGP EVPN — RT, RD, ESI, route types
  Data         VXLAN | MPLS | PBB
  Policy       which VRF/VNI, DCI or not, security zones
```

EVPN does **not** remove design judgment. Multi-site EVPN without a DCI requirement is how you stretch fate. Default: **L3 between sites**, EVPN inside a site (or inside a deliberately bounded fabric).

## What EVPN unifies

| Service | EVPN role | Classic pain it reduces |
|---|---|---|
| L2 ELAN | MAC advertisement, BUM via ingress-repl or P2MP | VPLS flood-and-learn |
| L3 VRF | IP prefix routes (type-5) | Separate L3VPN-only thinking in DC |
| Multihoming | ESI, DF election | MCT/vPC hacks without control plane |
| IRB / anycast GW | Integrated L2+L3 on leaf | Hairpin to centralized gateway |

Same BGP toolkit (RR, RT, communities) as L3VPN—ops skill transfers if you keep the mental model clean.

## Design still required

| Choice | Guidance |
|---|---|
| Underlay | IGP or eBGP; ECMP; MTU for encap |
| Overlay | VNI/VRF mapping; do not “one VNI everywhere” |
| Multihoming | ESI / LAG toward servers; dual-homed carefully |
| DCI | Prefer L3 handoff; L2 stretch only with explicit need |
| RR | Paired, diverse; EVPN scale can exceed IPv4 unicast |

## Decision table — EVPN scope

| Scope | Prefer |
|---|---|
| Single DC fabric | VXLAN EVPN inside; L3 to WAN |
| Two DCs, active-active apps | L3 DCI + anycast services; avoid L2 stretch |
| True L2 DCI required | Bounded EVI, BUM controls, clear MAC scale |
| Campus fabric | EVPN/SDA-style roles; still hierarchical failure domains |
| Classic MPLS WAN L3 only | Keep L3VPN; add EVPN when L2/IRB needed |

## Real-world — enterprise DC refresh

**Facts:** Two halls, leaf-spine, need multi-tenant VRFs, dual-homed servers, east-west heavy.

**Design:**

- eBGP or IGP underlay with ECMP
- VXLAN EVPN: L2 VNIs per app tier where needed; type-5 for inter-subnet
- Anycast gateway on leaves; ESI multihoming to TOR pairs
- Inter-hall: L3 only (VRF Lite / L3VPN / EVPN type-5)—no VLAN stretch
- RR pair in each hall or dedicated route servers

**Discarded:** Flood-and-learn VXLAN without EVPN. Stretching all VNIs between halls “for mobility.”

## Real-world — SP offering “LAN connect” between customer sites

**Facts:** Customer wants Ethernet between three metros; MAC count modest; SLA on availability.

**Design:** EVPN-VPWS or EVPN-ELAN over MPLS with per-customer EVI; ingress replication or P2MP for BUM; MAC limit and storm control on ACs. Quote L3VPN as cheaper alternative if they only need IP.

## Design checklist

1. Which route types do we depend on (2, 3, 4, 5, …)?
2. Is RT topology = service topology?
3. ESI / DF story for every dual-homed CE/server?
4. Underlay MTU and ECMP verified under failure?
5. Explicit “no L2 DCI” unless a named requirement exists?

## Risks

- Treating EVPN as permission to stretch L2 everywhere.
- Single RR for all EVPN + VPN families without capacity planning.
- Anycast GW without understanding ARP/ND and silent hosts.
- Mixing controller fabric and “DIY EVPN” without a clear ops boundary.

## Interview framing

“EVPN is BGP for L2/L3 overlay state. I still refuse to stretch L2 between DCs unless the requirement is explicit—and I keep underlay, overlay, and policy planes separate in the design.”

## Related

- [L3VPN versus L2VPN](02_L3VPN_vs_L2VPN.md)
- [VPN topologies](03_VPN_Topologies.md)
- [VXLAN EVPN data center](../14_Data_Center_and_Cloud/02_VXLAN_EVPN_DC.md)
- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)
- [Overlay, underlay, and fabric](../04_Planes_and_Traffic_Flow/04_Overlay_Underlay_and_Fabric.md)
- [EVPN in BGP library](../../02_BGP/19_EVPN/README.md)

---
