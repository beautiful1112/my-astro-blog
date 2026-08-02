# iBGP Split Horizon and Full Mesh

A route learned from one ordinary iBGP peer is not advertised to another ordinary iBGP peer. This prevents loops because iBGP does not prepend the local ASN.

Without route reflection or confederations, every iBGP speaker therefore needs a full mesh. For **n** routers:

**sessions = n(n - 1) / 2**

The rule concerns how BGP routes are propagated, not whether traffic can forward between routers.

At scale, the full mesh becomes operationally expensive. Route reflectors reduce session count but introduce path visibility and topology-design tradeoffs.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
