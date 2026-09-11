# Plane separation

Spines route outer VTEP packets. Leaves own endpoint learning, gateway functions, VNI mapping, and tenant policy.

VXLAN is an encapsulation. EVPN is the control plane.

| Plane | What lives here |
|---|---|
| Underlay | VTEP loopbacks, ECMP, BFD, MTU |
| Overlay data | VXLAN encapsulation between VTEPs |
| Overlay control | EVPN Type-2 / Type-3 / Type-5, route targets |
| Tenant policy | VRF, VNI, gateway, service insertion |

## Common confusion

The L3VNI does not “contain” a routing protocol. It is an overlay transit network for one tenant VRF. EVPN Type-5 routes provide prefixes, VTEP next hops, and remote router MAC information.

Without an overlay, every transit spine carrying tenant routes needs that VRF end to end. EVPN keeps spines tenant-unaware.

## Related

- [Underlay contract](../03_Underlay/01_Underlay_Contract.md)
- [EVPN route types](02_Route_Types.md)
- [Encapsulation versus control plane](../05_Static_VXLAN/01_Encapsulation_versus_Control_Plane.md)
- [What EVPN provides](../../02_BGP/19_EVPN/01_What_EVPN_Provides.md)

---
