# PIM Dense Mode

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM-DM assumes receivers are widespread:

1. New source traffic floods along RPF-valid paths.
2. Routers without downstream interest send Prunes.
3. Prune state expires, allowing reflooding.
4. A new receiver can trigger a Graft.
5. Assert selects one forwarder on shared media.

It is conceptually simple for genuinely dense small domains, but periodic flood-and-prune wastes bandwidth and state. It is a poor default for sparse high-rate market-data receivers.

