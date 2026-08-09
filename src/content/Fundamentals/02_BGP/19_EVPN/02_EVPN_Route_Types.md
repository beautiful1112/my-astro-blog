# EVPN Route Types

EVPN NLRI is typed. Behavior depends on **RD, RT, ESI, Ethernet Tag, label/VNI, next hop, and extended communities**—not only the type number.

## Common types

| Type | Name | Main purpose |
|---|---:|---|
| 1 | Ethernet Auto-Discovery (EAD) | Multihoming, aliasing, mass withdrawal |
| 2 | MAC/IP Advertisement | MAC and optional Host IP binding |
| 3 | Inclusive Multicast Ethernet Tag (IMET) | BUM tree / ingress-replication list |
| 4 | Ethernet Segment | ES discovery, DF election input |
| 5 | IP Prefix | IP prefixes independent of MAC |

Less common types (6–8+ for multicast join/sync, etc.) appear in advanced MVPN/EVPN designs—learn them when operating those features.

## Type roles in a dual-homed fabric

```text
Type-4  → PEs discover shared ESI, elect DF
Type-1  → aliasing / fast withdraw per ES or EVI
Type-2  → unicast MAC (/IP) to VTEP/PE
Type-3  → how BUM reaches other PEs
Type-5  → subnet prefixes for L3 overlay
```

## Attributes that always matter

| Field | Why |
|---|---|
| Route Target | Tenant / EVI membership |
| ESI | Zero for single-home; nonzero shared for MH |
| Ethernet Tag | VLAN / broadcast domain granularity |
| MPLS label or VNI | Service demux |
| Router MAC / MAC Mobility | IRB and move detection |

## Configuration / inspection

```text
show bgp l2vpn evpn route-type 1
show bgp l2vpn evpn route-type 2
show bgp l2vpn evpn route-type 3
show bgp l2vpn evpn route-type 4
show bgp l2vpn evpn route-type 5
```

Junos: `show route table bgp.evpn.0` with extensive.

## Interactions

| Mechanism | Relationship |
|---|---|
| **ESI multihoming** | Types 1 & 4 central—[03](03_ESI_and_Multihoming.md) |
| **DF** | Uses Type-4—[04](04_Designated_Forwarder_and_Split_Horizon.md) |
| **ARP suppression** | Uses Type-2 IP—[06](06_ARP_ND_Suppression.md) |
| **L3VPN** | Type-5 overlaps functionally with VPNv4 in some designs |

## Interview framing

“Know Type 1–5 by job: EAD, MAC/IP, IMET BUM, ES/DF, and IP prefix—and always read ESI, RT, and VNI/label, not just the type code.”

---
