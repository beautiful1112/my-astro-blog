# Case 5: One receiver leaves and others disappear

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Several receivers sit behind one downstream switch port. Fast leave is enabled upstream. One host leaves, and the upstream switch immediately removes the shared port, black-holing all remaining receivers.

Disable immediate leave on shared attachment or enforce genuine one-listener-per-port architecture.

