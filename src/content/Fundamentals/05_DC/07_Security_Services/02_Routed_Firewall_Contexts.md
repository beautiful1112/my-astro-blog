# Routed firewall contexts

Map each VRF to a VDOM, virtual system, or subinterface pair. Use distinct routing and NAT policy per tenant.

Intra-subnet traffic cannot be inspected by a routed firewall unless the traffic is forced through it. A routed context sees packets that are **routed to it**. East-west inspection inside a subnet needs a different insertion model (redirect, transparent bump-in-the-wire, or host/CNI policy).

## Design checks

- One tenant VRF → one firewall context (or a documented shared context).
- Distinct routing and NAT policy per tenant.
- Overlapping tenant prefixes stay isolated until an explicit NAT or proxy seam.
- Failover preserves the same context mapping.

## Related

- [Explicit service path](01_Explicit_Service_Path.md)
- [Transparent HA](03_Transparent_HA.md)
- [Overlapping addresses](../06_VRFs_and_Gateways/02_Overlapping_Addresses.md)

---
