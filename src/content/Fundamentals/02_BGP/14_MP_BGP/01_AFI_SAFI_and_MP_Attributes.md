# AFI, SAFI, and Multiprotocol BGP

RFC 4760 extends BGP to carry multiple network-layer protocols. An address family is identified by:

- **AFI:** address family, such as IPv4 or IPv6.
- **SAFI:** subsequent address family, such as unicast, labeled unicast, VPN, or FlowSpec.

MP_REACH_NLRI advertises reachable NLRI and its next hop. MP_UNREACH_NLRI withdraws it.

Capabilities negotiate support per AFI/SAFI. A TCP session can be Established while a particular family is inactive or failed to negotiate.

Treat every family as a separate routing context with its own activation, import/export policy, maximum prefixes, and observability.

---

