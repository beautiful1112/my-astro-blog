# AFI, SAFI, and Multiprotocol BGP

RFC 4760 extends BGP so one TCP session can carry many network-layer routing contexts. Each context is an **AFI/SAFI** pair. Classic IPv4 unicast can still use the original NLRI encoding; almost everything else uses **MP_REACH_NLRI** / **MP_UNREACH_NLRI**.

## Identifiers

| Field | Role | Examples |
|---|---|---|
| **AFI** | Network-layer protocol | 1 = IPv4, 2 = IPv6, 25 = L2VPN |
| **SAFI** | How the NLRI is used | 1 unicast, 2 multicast, 4 labeled unicast, 128 VPNv4/VPNv6, 70 EVPN, 133 FlowSpec |

Exact SAFI numbers matter in capabilities and troubleshooting dumps—learn the families you operate.

## MP attributes

| Attribute | Type | Function |
|---|---|---|
| **MP_REACH_NLRI** | 14 | Advertises NLRI + next-hop encoding for one AFI/SAFI |
| **MP_UNREACH_NLRI** | 15 | Withdraws NLRI for one AFI/SAFI |

Path attributes (AS_PATH, LOCAL_PREF, communities, MED, …) apply to the MP advertisement the same way they apply to classic IPv4 updates, subject to family-specific rules (e.g. RT extended communities on VPN routes).

## Capability negotiation

Peers advertise supported AFI/SAFI lists in OPEN capabilities. Only **mutually supported** families are exchanged. A session can be **Established** while a given family is inactive, rejected, or never activated under the neighbor.

```text
OPEN capability: Multiprotocol Extensions
  AFI 1 SAFI 1   (IPv4 unicast)
  AFI 1 SAFI 128 (VPNv4)
  AFI 25 SAFI 70 (EVPN)
```

## Mental model

Treat every family as a **separate routing context**:

- separate activation;
- separate import/export policy;
- separate maximum-prefix / dampening knobs where offered;
- separate RIB and show commands;
- separate next-hop validation rules.

## Configuration sketch

### Cisco

```text
router bgp 65000
 neighbor 192.0.2.2 remote-as 65000
 address-family vpnv4
  neighbor 192.0.2.2 activate
  neighbor 192.0.2.2 send-community extended
 exit-address-family
 address-family l2vpn evpn
  neighbor 192.0.2.2 activate
 exit-address-family
```

### Junos

```text
set protocols bgp group IBGP family inet-vpn unicast
set protocols bgp group IBGP family evpn signaling
```

## Interactions

| Topic | Link / note |
|---|---|
| Per-family activation | [07_Per_Family_Activation_and_Policy](07_Per_Family_Activation_and_Policy.md) |
| L3VPN families | [05_VPNv4_and_VPNv6](05_VPNv4_and_VPNv6.md), module [18](../18_MPLS_L3VPN/README.md) |
| Multicast SAFI | [06](06_Multicast_SAFIs_and_PIM_Relationship.md) |
| Soft reset | Route refresh is often per-family |

## Verification

```text
show bgp neighbors 192.0.2.2
! Negotiated NLRI / Address family
show bgp vpnv4 unicast summary
show bgp l2vpn evpn summary
```

Never infer family health from “BGP is Established” alone.

## Interview framing

“MP-BGP uses AFI/SAFI capability negotiation and MP_REACH/MP_UNREACH so one session carries many families; each family has its own activation, policy, and RIB.”

---
