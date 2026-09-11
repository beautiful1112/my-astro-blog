# General compute fabric

Layer-3 Clos underlay, MP-BGP EVPN overlay, symmetric IRB, distributed anycast gateways, and VRF-based tenancy.

This is the default network for the 900 servers: platform, production, Kubernetes, and anything that does not have a measured ultra-low-latency budget to an exchange.

## Building blocks

| Block | Role in this design |
|---|---|
| Underlay | eBGP Clos so every VTEP loopback is reachable over four-way ECMP |
| Overlay | MP-BGP EVPN carries tenant MAC/IP and prefixes |
| IRB | Symmetric: L2VNI → L3VNI → L2VNI |
| Gateway | Distributed anycast on participating leaves |
| Tenancy | VRF + L3VNI + L2VNI + route targets |

Spines route outer VTEP packets. They do not hold tenant VRFs merely to switch the fabric.

## What this fabric is for

- East-west scale across 30 racks.
- Multi-tenant isolation without overlapping-address accidents.
- Host mobility inside a VNI without changing the default gateway.
- A stable attachment point for service and border leaves.

## What this fabric is not for

- The last hop of exchange fan-out when Layer-1 or FPGA switching owns the latency budget.
- Policy enforcement for every north-south flow — that belongs on [service leaves](04_Service_Insertion.md).
- Stretching every VLAN between sites “for mobility.”

## Related

- [One fabric, two paths](01_One_Fabric_Two_Paths.md)
- [Underlay contract](../03_Underlay/01_Underlay_Contract.md)
- [Plane separation](../04_EVPN_VXLAN/01_Plane_Separation.md)
- [VXLAN EVPN data center](../../04_CCDE/14_Data_Center_and_Cloud/02_VXLAN_EVPN_DC.md)

---
