# PIM Assert on shared LANs

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

If two routers forward the same stream onto a shared LAN, PIM Assert elects one forwarder for that `(S,G)` or `(*,G)` using route preference/metric and an address tie-breaker. The loser stops forwarding for the Assert lifetime.

Do not confuse:

- **DR election:** which router acts for connected hosts/sources.
- **Assert election:** which router forwards a specific flow onto a multiaccess LAN after duplicates are detected.

