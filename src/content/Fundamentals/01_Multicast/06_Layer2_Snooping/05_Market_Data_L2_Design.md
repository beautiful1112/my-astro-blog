# Layer-2 design for market data

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- Keep loss-sensitive multicast VLANs small and intentional.
- Provide redundant queriers in L2-only feed networks.
- Verify `(VLAN,G)` and, where supported, `(VLAN,S,G)` scale.
- Validate replication fan-out, egress bandwidth, and simultaneous high-rate channels.
- Check MLAG peer-link and failover programming.
- Treat SPAN as potentially lossy; use a TAP or reliable capture path when exact loss evidence matters.

