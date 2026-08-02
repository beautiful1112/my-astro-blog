# BGP Prefix-SID Advertisement

The BGP Prefix-SID attribute advertises Segment Routing information associated with a prefix. It can support SR-MPLS and related interdomain or service designs.

The route still needs normal BGP selection and next-hop resolution. The Prefix-SID information supplies label/index behavior; it does not independently make the route reachable.

Check consistency between:

- Advertised prefix.
- SR domain and SID allocation.
- Label block or absolute label semantics.
- Next-hop transport.
- Hardware label programming.

Conflicting or reused SID allocations can create forwarding to the wrong endpoint.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
