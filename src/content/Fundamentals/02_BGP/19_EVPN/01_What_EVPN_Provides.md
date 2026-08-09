# What EVPN Provides

**Ethernet VPN (EVPN)** uses MP-BGP (AFI 25 / SAFI 70) to distribute MAC, IP, Ethernet-segment, and IP-prefix reachability. It replaces or augments pure data-plane flood-and-learn with a **control-plane learning** model suitable for DC fabrics and SP L2/L3 services.

## Capabilities

| Capability | Role |
|---|---|
| Multi-homing (ESI) | All-active or single-active CE/server attachment |
| MAC mobility | Sequence-numbered moves between PEs/VTEPs |
| IRB / L3 gateway | Integrated routing and bridging |
| ARP/ND suppression | Answer from Type-2 bindings |
| Tenant separation | Route Targets per EVI / VRF |
| BUM delivery | Type-3 IMET + underlay multicast or ingress replication |
| IP prefix (Type-5) | L3VPN-like prefixes over EVPN |

## Control vs data plane

```text
MP-BGP EVPN  →  who owns which MAC/IP/ESI/prefix (next hop = PE/VTEP)
Encapsulation →  VXLAN / MPLS / PBB delivers frames to that next hop
Underlay      →  IP fabric or MPLS transport reachability
```

BGP distributes reachability; encapsulation and underlay deliver packets. Correct EVPN RIB with broken underlay still fails.

## Relationship to classic L3VPN

| | EVPN | MPLS L3VPN |
|---|---|---|
| Primary NLRI | MAC/IP, ESI, prefixes | IPv4/IPv6 + RD |
| L2 services | Native | Not the focus |
| L3 | Type-5 / IRB | VPNv4/VPNv6 |
| Multihoming | ESI / DF | Often PE-CE routing + SoO |

## Configuration sketch

```text
router bgp 65000
 neighbor 192.0.2.1 remote-as 65000
 address-family l2vpn evpn
  neighbor 192.0.2.1 activate
  neighbor 192.0.2.1 send-community extended
```

```text
set protocols bgp group RR family evpn signaling
set protocols evpn encapsulation vxlan
```

## Interactions

| Topic | Link |
|---|---|
| Route types | [02](02_EVPN_Route_Types.md) |
| RT / RD concepts | [18](../18_MPLS_L3VPN/README.md) (same RT idea) |
| RR / ADD-PATH | [13](../13_Route_Reflection_and_Confederations/README.md) |

## Verification

```text
show bgp l2vpn evpn summary
show bgp l2vpn evpn route-type 2
show evpn mac
ping / traceroute across overlay
```

## Interview framing

“EVPN is MP-BGP control plane for Ethernet and IP reachability—multihoming, mobility, IRB, and suppression—over VXLAN or MPLS data planes; underlay still has to reach the advertised next hop.”

---
