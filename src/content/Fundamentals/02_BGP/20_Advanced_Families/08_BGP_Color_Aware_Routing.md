# BGP Color-Aware Routing

BGP Color-Aware Routing (CAR) distributes transport routes keyed by endpoint and intent/color across multiple domains. It can carry MPLS label stacks, SR-MPLS label indexes, or SRv6 SIDs and steer colored service routes onto matching transport paths.

RFC 9871 defines:

- CAR SAFI 83.
- VPN CAR SAFI 84.
- Color-aware and IP-prefix NLRI types.
- Recursive color-aware next-hop resolution.

The color has operator-defined intent such as low delay or resource avoidance; every color domain must maintain or explicitly translate that meaning.

RFC 9871 is Experimental, published in November 2025. Treat implementation support and interoperability as an advanced design topic, not a universal BGP baseline.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
