# Encapsulation versus control plane

Without EVPN, remote MACs are learned from decapsulated frames and BUM traffic must be replicated to configured VTEPs or an underlay multicast group.

**Accurate interview answer:** Static VXLAN propagates no MAC routes. It flood-and-learns remote MACs. An L3VNI advertises nothing by itself; use a separate per-VRF routing protocol, or centralize routing at a gateway pair.

This is why the reference fabric uses EVPN. Static VXLAN is the control-plane-less baseline you must be able to explain so EVPN is not magic.

## Related

- [Flood and learn](02_Flood_and_Learn.md)
- [Static versus EVPN](03_Static_versus_EVPN.md)
- [Plane separation](../04_EVPN_VXLAN/01_Plane_Separation.md)

---
