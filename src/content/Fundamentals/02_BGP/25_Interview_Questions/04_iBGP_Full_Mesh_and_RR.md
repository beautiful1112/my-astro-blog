# Interview: Why Does iBGP Need a Full Mesh?

## Question

Why does ordinary iBGP require a full mesh, and how does route reflection change it?

## Strong answer

iBGP does not prepend the local ASN, so a route learned from one ordinary iBGP peer is not advertised to another. A full mesh ensures every speaker receives routes directly. Route reflectors relax that rule for clients and add ORIGINATOR_ID and CLUSTER_LIST loop protection. They reduce session count but can hide alternate paths and choose from the reflector's topology viewpoint.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
