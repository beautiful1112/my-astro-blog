# Operational Command References

## Inspection (IPv4 classic-oriented; named has `show eigrp ...` variants)

| Intent | Command |
|---|---|
| Neighbors | `show ip eigrp neighbors [detail]` |
| Interfaces | `show ip eigrp interfaces [detail]` |
| Topology | `show ip eigrp topology` / `active` / prefix |
| Traffic counters | `show ip eigrp traffic` |
| Protocols | `show ip protocols` |
| RIB | `show ip route eigrp` / `show ip route <prefix>` |
| Events | `show ip eigrp events` (when supported) |
| Key chains | `show key chain` |

## Named-mode awareness

Many platforms expose `show eigrp address-family ipv4 ...` style commands—verify on your train. Do not assume classic-only syntax in mixed estates.

## Debug (lab / controlled)

- Prefer interface- or neighbor-scoped debugs.
- Packet debug on hubs with hundreds of peers is an outage generator.

## Cross-links

[Essential show commands](../19_Operations_and_Observability/01_Essential_Show_Commands.md), [Debug strategy](../19_Operations_and_Observability/03_Debug_Strategy.md).

---
