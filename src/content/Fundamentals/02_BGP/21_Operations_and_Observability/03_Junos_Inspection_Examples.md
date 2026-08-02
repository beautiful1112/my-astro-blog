# Junos BGP Inspection Examples

Useful Junos-style commands include:

    show bgp summary
    show bgp neighbor 192.0.2.1
    show route 203.0.113.0/24 detail
    show route protocol bgp
    show route receive-protocol bgp 192.0.2.1
    show route advertising-protocol bgp 192.0.2.1
    show route forwarding-table destination 203.0.113.1

Add **table** selection for inet6, VPN, EVPN, or VRF contexts.

Junos policy evaluation can be traced, but tracing is potentially expensive. Scope it by neighbor/prefix and remove it after the observation window.

Always distinguish the routing table, protocol route view, and forwarding table.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
