# MRIB selection and asymmetric paths

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

PIM is protocol-independent because it consumes routing information from another system. The MRIB may derive from the unicast RIB, multicast-specific BGP routes, or static multicast routes.

Asymmetric unicast is not automatically wrong. Failure occurs when multicast data arrives somewhere other than the selected reverse path to `S` or the RP. Causes include more-specific routes, failure-induced metric changes, VRF/policy differences, ECMP selection, and tunnels.

Do not add a static mroute until you understand why topology and RPF disagree.

