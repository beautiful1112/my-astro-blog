# BGP-LS SPF Routing

RFC 9815 defines an Experimental mechanism that lets BGP speakers compute shortest paths from link-state information carried by BGP-LS.

This differs from ordinary BGP-LS export, where a controller consumes topology objects. In SPF routing, BGP performs link-state-style route computation within the intended controlled domain.

Key concerns:

- Complete and consistent topology information.
- Metric and algorithm definition.
- Flooding/distribution scale.
- Failure convergence.
- Strict domain and policy boundaries.

This is not how Internet eBGP normally selects paths. Learn it after mastering standard BGP policy and BGP-LS data distribution.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
