# What EVPN Provides

Ethernet VPN (EVPN) uses MP-BGP to distribute MAC, IP, Ethernet-segment, and IP-prefix reachability. It replaces or augments data-plane flood-and-learn with a control-plane model.

EVPN can run over MPLS or VXLAN data planes. Key capabilities include:

- Multi-homing.
- MAC mobility.
- Integrated routing and bridging.
- ARP/ND suppression.
- Policy and tenant separation through route targets.

BGP distributes reachability; the encapsulation and underlay deliver packets to the advertised next hop.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
