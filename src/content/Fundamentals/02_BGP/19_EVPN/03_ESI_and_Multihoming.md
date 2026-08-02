# Ethernet Segment Identifier and Multihoming

An Ethernet Segment Identifier (ESI) identifies a customer Ethernet segment attached to one or more PEs. A nonzero common ESI signals EVPN multihoming.

It supports:

- All-active or single-active redundancy.
- Designated-forwarder election.
- Split-horizon filtering.
- Aliasing to multiple PEs.
- Fast mass withdrawal when an attachment fails.

The ESI must be unique to the actual segment. Accidental reuse can merge unrelated failure domains and produce incorrect forwarding.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
