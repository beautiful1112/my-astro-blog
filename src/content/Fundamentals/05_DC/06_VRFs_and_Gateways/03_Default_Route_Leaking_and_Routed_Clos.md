# Default route, leaking, and routed Clos

## Default route

Originate a per-VRF default from the firewall or service edge. Track reachability so a dead exit is withdrawn.

Do not originate one global default and leak it everywhere. Each tenant VRF needs its own exit story.

## Route leaking

Import only explicit prefixes. Overlapping addresses require NAT, a VRF-aware proxy, split DNS, or separate firewall contexts.

Route targets decide what is imported — not the VNI alone. A shared services VRF is an explicit import list, not “the production prefix also exists in trading.”

## Pure routed Clos

Without an overlay, every transit spine carrying tenant routes needs that VRF end to end. EVPN keeps spines tenant-unaware.

That is the operational reason for overlay even when every subnet is routed and no VM needs Layer-2 adjacency.

## Related

- [Object hierarchy](01_Object_Hierarchy.md)
- [Overlapping addresses](02_Overlapping_Addresses.md)
- [Explicit service path](../07_Security_Services/01_Explicit_Service_Path.md)
- [Inter-VRF leaking](../../02_BGP/18_MPLS_L3VPN/05_Inter_VRF_Leaking.md)

---
