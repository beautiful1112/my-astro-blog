# MPLS L3VPN Control Plane

In an RFC 4364 L3VPN:

- Customer-edge (CE) routes enter a VRF on a provider-edge (PE) router.
- The PE converts them to VPNv4 or VPNv6 routes with an RD, label, and route targets.
- MP-BGP distributes them to other PEs.
- Importing PEs place matching routes into destination VRFs.

Provider (P) routers need transport labels and PE reachability, not customer VPN routes.

The separation of VPN service routes from the provider core is a major scaling property.

---

