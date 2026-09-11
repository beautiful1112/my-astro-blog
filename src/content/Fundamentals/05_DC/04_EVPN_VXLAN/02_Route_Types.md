# EVPN route types

The three route types this fabric lives on.

## Type-2 — MAC / IP

Endpoint reachability, ARP suppression, and host routes.

Carries: MAC · IP · VTEP · mobility sequence.

## Type-3 — IMET

VTEP participation in a broadcast domain for BUM replication.

Carries: VNI membership · tunnel endpoint.

## Type-5 — IP prefix

Tenant subnet or aggregate reachability through the L3VNI.

Carries: Prefix · RT · VTEP · router MAC.

| Need | Route type |
|---|---|
| Host MAC/IP, ARP suppression, mobility | Type-2 |
| Flood list for a VNI | Type-3 |
| Subnet or aggregate through the L3VNI | Type-5 |

Protocol depth: [EVPN route types](../../02_BGP/19_EVPN/02_EVPN_Route_Types.md).

## Related

- [Plane separation](01_Plane_Separation.md)
- [Symmetric IRB](03_Symmetric_IRB.md)
- [Static versus EVPN](../05_Static_VXLAN/03_Static_versus_EVPN.md)

---
