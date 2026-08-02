# Final BGP Tie-Breakers

When meaningful policy and path metrics tie, implementations need deterministic final criteria. Common candidates include:

- Prefer the oldest external path for stability.
- Prefer the path from the peer with lowest BGP router ID.
- Prefer the shortest route-reflector CLUSTER_LIST.
- Prefer the lowest neighbor address.

The exact placement and behavior differ by vendor and configuration. These tie-breakers are designed for determinism, not business intent.

If production traffic depends on a router-ID or neighbor-address tie-break, policy is underspecified. Add a deliberate preference before maintenance, because replacing a router or renumbering a peer can silently change the winner.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
