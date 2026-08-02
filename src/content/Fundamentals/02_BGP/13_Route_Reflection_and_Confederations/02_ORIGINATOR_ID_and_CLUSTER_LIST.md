# ORIGINATOR_ID and CLUSTER_LIST

Route reflection adds two loop-prevention attributes:

- **ORIGINATOR_ID:** router ID of the iBGP speaker that originated the route inside the AS.
- **CLUSTER_LIST:** sequence of route-reflector cluster IDs through which the route was reflected.

A router rejects a reflected route if its own router ID matches ORIGINATOR_ID. An RR rejects a route containing its own cluster ID in CLUSTER_LIST.

Redundant RRs may share a cluster ID when they represent one logical cluster, but the design changes which reflected routes are accepted. Document cluster boundaries and IDs; accidental duplication can silently hide routes.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
