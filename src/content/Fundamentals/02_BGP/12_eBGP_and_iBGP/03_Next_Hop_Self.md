# next-hop-self

iBGP normally preserves the eBGP next hop. If internal routers cannot route to an external link address, they may receive a valid BGP path whose next hop is unresolved.

**next-hop-self** rewrites the advertised next hop to an address of the iBGP speaker. Internal routers then resolve the edge router through the IGP.

Use cases:

- Internet edge routes distributed to internal routers.
- Route-reflector designs with controlled next-hop behavior.
- Layer-3 VPN or EVPN designs where next-hop resolution must match the transport underlay.

It is not automatically correct everywhere. Preserving external next hops can enable direct forwarding and avoid tromboning when the underlay has reachability. Decide from the intended data path.

---

