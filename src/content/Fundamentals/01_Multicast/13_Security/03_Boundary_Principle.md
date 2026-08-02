# The three-level boundary principle

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Apply policy at three levels:

1. **Source admission:** who may send which groups?
2. **Tree admission:** which interfaces/routers may create state?
3. **Receiver admission:** which VLANs, ports, and hosts may receive?

A firewall rule allowing UDP to `239.0.0.0/8` is not a complete security design.

