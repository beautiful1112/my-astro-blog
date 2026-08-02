# Multicast with VXLAN and EVPN

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Classic VXLAN may use underlay multicast to replicate BUM traffic. EVPN reduces flood-and-learn behavior using control-plane MAC/IP advertisement and can use ingress replication or underlay multicast for remaining BUM.

Tenant IP multicast is distinct from multicast used to transport overlay BUM. Ask:

1. Is multicast only an underlay VXLAN replication mechanism?
2. Must tenant multicast cross VNIs/VRFs?
3. Is replication ingress-based or tree-based?
4. Which control plane represents receiver/source state, and what are its scale limits?

Support varies by vendor, ASIC, and software release.

