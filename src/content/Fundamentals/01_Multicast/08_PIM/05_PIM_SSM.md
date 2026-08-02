# PIM Source-Specific Multicast

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

1. The receiver sends IGMPv3/MLDv2 `INCLUDE {S}` for `G`.
2. The LHR creates `(S,G)` state.
3. PIM `(S,G)` Joins travel directly toward `S` following RPF.
4. Data follows the source-rooted SPT.

There is no `(*,G)`, RP, Register, Register-Stop, or MSDP source discovery. Routers still need PIM adjacencies and MRIB reachability toward the source.

