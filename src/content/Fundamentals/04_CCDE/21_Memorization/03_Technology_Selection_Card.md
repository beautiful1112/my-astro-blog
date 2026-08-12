# Technology selection card

| Need | Reach for | Avoid |
|---|---|---|
| Small L2 island | VLAN + MLAG | Campus-wide STP |
| Enterprise IGP Cisco WAN | EIGRP stub/summary | Flat query domain |
| Multi-vendor campus | OSPF areas | EIGRP-only |
| Large MPLS/SR core | IS-IS + BGP VPN | Tenant prefixes in IGP |
| Policy/scale/Internet | BGP | Full table in IGP |
| Multitenant WAN | MPLS/EVPN L3VPN | L2 VPLS by default |
| East-west DC | Leaf-spine EVPN | Stretched VLAN DCI |
| Branch app-SLA | SD-WAN + 2 underlays | Overlay on one DIA |
| Known multicast sources | SSM | Random PIM everywhere |
| Scarcity | Few DiffServ classes | 12 unused queues |

---
