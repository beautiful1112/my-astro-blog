# Interview: Explain Route-Reflector Path Hiding

## Question

What is route-reflector path hiding, and why does it matter?

## Strong answer

An RR usually selects one best path and advertises it to clients. A client may never see another path that would be better from its own IGP position, causing suboptimal exit, loss of ECMP, or slower failover. ADD-PATH, topology-aware RR placement, and diverse control-plane sessions can mitigate it.

---

