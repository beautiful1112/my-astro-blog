# Designated Forwarder and Split Horizon

For each VLAN/bundle on a multihomed Ethernet segment, the Designated Forwarder (DF) controls selected forwarding from the EVPN core toward the segment, especially BUM traffic.

Split-horizon mechanisms prevent traffic received from a multihomed segment from being sent back to that same segment through another PE.

DF election and convergence affect duplicate or lost BUM traffic. Inspect:

- ESI membership.
- Route type 4 exchange.
- DF algorithm and preference.
- Ethernet-tag granularity.
- Data-plane split-horizon label or identifier.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
