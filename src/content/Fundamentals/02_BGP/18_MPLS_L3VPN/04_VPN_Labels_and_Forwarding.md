# VPN Labels and Forwarding

An L3VPN data packet typically carries a **label stack**: outer **transport** label(s) to reach the egress PE, and an inner **VPN (service) label** that identifies the VRF or CE context on that PE.

## Stack

```text
[ transport label ][ VPN label ][ customer IP packet ]
```

- Core **P** routers swap/pop **transport** only (penultimate hop may pop transport).
- Egress **PE** uses **VPN label** → VRF / adjacency.
- After VPN pop, IPv4/IPv6 lookup in the VRF toward the CE.

## Label allocation modes

| Mode | Behavior |
|---|---|
| Per-prefix | Distinct VPN label per prefix (more labels) |
| Per-VRF (`vrf-table-label` / aggregate label) | One label → VRF table lookup |
| Per-CE / per-next-hop | Labels bound to CE adjacency |

Per-VRF labels save label space and enable certain features (e.g. summarization inside VRF) with different PHP/TTL behaviors—know your platform default.

## Control plane source of VPN label

The VPN label is advertised in MP-BGP VPNv4/VPNv6 NLRI together with the RD+prefix. The BGP next hop is normally the advertising PE loopback, which must resolve via transport (LDP/SR/LU).

## Forwarding failure checklist

| Symptom | Check |
|---|---|
| Route in VRF, ping fails | Transport LSP to NH? VPN label in LFIB? |
| TTL expiry in core | Expected if transport TTL propagate |
| Works one direction | Asymmetric RT import or CE routing |
| Label imbalance | PHP / explicit-null / QoS pipe mode |

## Configuration notes

```text
! Junos per-VRF label
set routing-instances CUST vrf-table-label

! Cisco often allocates per-prefix by default under VPNv4
show mpls forwarding-table vrf CUST
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **BGP LU / SR** | Builds transport to PE NH |
| **PIC** | Backup transport / VPN NH |
| **Option B/C inter-AS** | VPN and/or transport labels rewritten at ASBR |
| **next-hop-self** | PE/ASBR may rewrite BGP NH and re-originate labels |

## Verification

```text
show bgp vpnv4 unicast vrf CUST 10.1.0.0
! in label / out label
show mpls forwarding-table
traceroute vrf CUST 10.1.0.1
ping mpls ipv4 <pe-loopback>/32
```

## Interview framing

“L3VPN forwarding uses an outer transport label to the egress PE and an inner VPN label from MP-BGP that selects the VRF; P routers never need customer routes.”

---
