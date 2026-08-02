# Why exchanges use multicast

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

An exchange must deliver the same ordered event stream to many participants at low fan-out latency. UDP multicast lets it send one copy per distribution path rather than maintain one TCP stream per customer. It avoids per-receiver sender state and TCP head-of-line blocking.

The receiver assumes responsibility for detecting loss, arbitrating redundant lines, recovering gaps, and maintaining correct book state.

