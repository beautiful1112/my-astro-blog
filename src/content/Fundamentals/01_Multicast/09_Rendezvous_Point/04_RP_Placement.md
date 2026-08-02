# RP placement considerations

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Evaluate:

- path stretch and latency before SPT switchover;
- Register load from sources;
- `(*,G)` join convergence from receivers;
- IGP convergence and failure domains;
- CPU/control-plane protection;
- number of groups and active sources;
- whether SSM can eliminate the RP entirely.

For controlled one-source market feeds, SSM is usually more robust than engineering a complex RP service.

