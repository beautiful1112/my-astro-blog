# Five-step interview narrative

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

When asked how multicast works:

1. A sender transmits one best-effort packet to `G`; it need not join.
2. A receiver joins locally with IGMP/MLD, possibly specifying `S`.
3. Snooping constrains Layer-2 copies to listener and mrouter ports.
4. PIM builds routed state, RPF validates the source direction, and routers replicate at branches.
5. UDP applications handle ordering, loss, duplication, and recovery—especially important for market data.

