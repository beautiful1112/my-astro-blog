# PIM control-plane facts

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- PIM is IP protocol number **103**.
- Hellos use `224.0.0.13` for IPv4 or `ff02::d` for IPv6.
- Hellos discover neighbors, negotiate options, and elect a DR.
- Join/Prune is hop-by-hop soft state refreshed periodically.
- Highest numeric DR Priority wins when all advertise it; otherwise highest primary IP wins.
- A PIM adjacency proves only neighbor communication—not correct RPF, RP mapping, group state, or forwarding hardware.

