# State and tree notation

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- `(*,G)`: shared state for all sources to group `G`; RPF is normally toward the RP.
- `(S,G)`: source-specific state; RPF is toward `S`.
- `(S,G,rpt)`: prune state for a source on the RP tree after SPT transition.
- **RPT:** RP-rooted shared tree.
- **SPT:** source-rooted shortest-path tree.
- **IIF:** expected incoming interface.
- **OIF/OIL:** outgoing interface or list receiving replicated copies.
- **FHR/LHR:** first-hop router beside the source; last-hop router beside receivers.
- **DR:** PIM Designated Router acting for hosts on a multiaccess link.
- **MRIB:** routing information used for multicast RPF decisions.
- **MFIB:** programmed forwarding/replication state.

