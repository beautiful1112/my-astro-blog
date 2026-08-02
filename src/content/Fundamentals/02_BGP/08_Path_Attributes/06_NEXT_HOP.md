# NEXT_HOP

NEXT_HOP tells the receiving router where to forward traffic for the advertised NLRI. The BGP path is usable only if that address can be resolved recursively through the routing table.

Typical behavior:

- eBGP normally sets NEXT_HOP to the advertising router on the external link.
- iBGP commonly preserves the existing NEXT_HOP.
- **next-hop-self** changes it to an address of the advertising iBGP router.
- MP-BGP encodes next-hop information in MP_REACH_NLRI rather than the classic NEXT_HOP attribute.

A route can be visible in the BGP table yet absent from the main RIB because the next hop is unresolved. If an IGP supplies reachability to BGP next hops, an IGP change can therefore alter or invalidate many BGP paths.

## Diagnostic chain

Check the exact BGP next hop, its recursive route, the final connected adjacency, and the outgoing interface. “BGP is Established” proves none of these.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
