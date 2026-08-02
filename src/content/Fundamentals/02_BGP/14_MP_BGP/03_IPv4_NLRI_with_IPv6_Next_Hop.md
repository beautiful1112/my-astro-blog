# IPv4 NLRI with an IPv6 Next Hop

RFC 8950 allows IPv4 NLRI to be advertised with an IPv6 next-hop address using MP-BGP. This supports IPv6-only underlays that still carry IPv4 reachability.

Requirements include compatible capability signaling, correct next-hop encoding, and recursive IPv6 reachability to the advertised next hop.

Troubleshooting must cross families:

1. Confirm IPv4 NLRI was received.
2. Read the IPv6 next hop from MP_REACH_NLRI.
3. Resolve that address through the IPv6 underlay.
4. Verify the data plane supports the intended encapsulation or forwarding.

A functioning IPv6 BGP transport does not by itself prove IPv4-over-IPv6 next-hop support.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
