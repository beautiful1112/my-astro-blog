# Case 3: RPF failure after a route change

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Traffic physically arrives through Core-A, but a new more-specific route to `S` points through Core-B. Membership and OIL state remain intact, yet the router drops data as non-RPF.

Repair the intended MRIB/unicast topology or deliberately engineer multicast-specific reachability. Changing the receiver join does not solve the source-side mismatch.

