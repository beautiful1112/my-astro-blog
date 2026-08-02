# Multiprotocol BGP for multicast

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Multicast and unicast topologies may differ. MP-BGP can carry multicast reachability in a multicast SAFI so the MRIB selects the intended RPF path without changing unicast forwarding.

MBGP does **not** carry multicast packets or build distribution trees. It supplies reachability; PIM consumes that information to construct trees.

