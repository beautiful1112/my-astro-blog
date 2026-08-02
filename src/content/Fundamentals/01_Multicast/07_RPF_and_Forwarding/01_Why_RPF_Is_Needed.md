# Why multicast needs RPF

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Unicast forwarding follows only a destination. Multicast must accept traffic from a source and replicate it without loops. The router therefore validates the source-facing direction before using group-facing outgoing state.

RPF is the fundamental loop-prevention rule behind multicast forwarding.

