# Direct and multihop eBGP

Direct eBGP normally peers across a connected link. Many implementations send with TTL 1 by default, providing limited off-link exposure.

Multihop eBGP is needed when peers use loopbacks, cross intermediate routers, or rely on resilient routed underlay reachability. It requires:

- a reachable neighbor address in both directions;
- sufficient TTL/hop limit;
- a stable source address/update source;
- explicit failure detection because the physical link is no longer the session's fate-sharing signal.

Multihop improves session resilience but can conceal broken forwarding paths if recursive reachability survives incorrectly.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
