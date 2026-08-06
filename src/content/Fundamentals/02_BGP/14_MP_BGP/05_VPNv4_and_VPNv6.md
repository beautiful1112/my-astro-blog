# VPNv4 and VPNv6 Address Families

VPNv4 and VPNv6 NLRI combine:

- A Route Distinguisher.
- The customer IP prefix.
- An MPLS label.

Route-target extended communities control which VRFs import the route. Provider-edge routers exchange the VPN family through MP-BGP while the provider core needs transport reachability to PE next hops, not customer routes.

For a VPN route to forward, all layers must align: VPN route selection, RT import, next-hop resolution, transport label, VPN/service label, and customer-facing adjacency.

The same customer prefix can exist in multiple VPNs because different RDs make the NLRI distinct.

---

