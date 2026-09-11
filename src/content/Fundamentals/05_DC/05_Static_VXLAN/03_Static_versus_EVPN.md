# Static versus EVPN

| Function | Static VXLAN | EVPN VXLAN |
|---|---|---|
| VTEP discovery | Manual peer list | Type-3 IMET |
| Remote MAC | Data-plane learning | Type-2 route |
| IP–MAC binding | ARP / ND flooding | Type-2 plus suppression |
| Tenant prefix | Separate static, OSPF, or IPv4 BGP process | Type-5 route |
| Host move | Traffic, gratuitous ARP, or aging | Mobility sequence |
| Typical routing | Centralized gateway or asymmetric IRB | Distributed symmetric IRB |

Static VXLAN propagates no MAC routes. It flood-and-learns remote MACs. An L3VNI advertises nothing by itself; use a separate per-VRF routing protocol, or centralize routing at a gateway pair.

## Related

- [Flood and learn](02_Flood_and_Learn.md)
- [EVPN route types](../04_EVPN_VXLAN/02_Route_Types.md)
- [EVPN over VXLAN vs MPLS](../../02_BGP/19_EVPN/07_VXLAN_vs_MPLS_Data_Planes.md)

---
