# Bidirectional PIM

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

BIDIR-PIM builds a bidirectional shared tree rooted at an RP address for many-to-many applications. Traffic flows up and down the shared tree without PIM Register encapsulation or per-source `(S,G)` core state. A Designated Forwarder is elected per link/RP to prevent loops.

It scales source state well, but paths may be non-shortest and deployment support is less universal. It is rarely the first choice for one-to-many low-latency market data.

