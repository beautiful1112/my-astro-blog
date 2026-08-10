# Troubleshooting Chain to Memorize

Memorize this order; do not skip steps.

1. **Physical / interface / VRF** — up/up, correct VRF, ACLs.
2. **Neighbors** — AS, K, subnet, auth, passive, proto 88 / 224.0.0.10, static-neighbor multicast side effect.
3. **Topology** — prefix present? successor? FS? Passive or Active? FD/RD/FC arithmetic.
4. **RIB** — AD competition (90/170/5 vs OSPF/static/BGP); distribute-lists; distance.
5. **Redistribution** — seed metric, tags, route-maps.
6. **Variance / max-paths** — FC still required; CEF next hops.
7. **Query / SIA** — stub/summary boundaries; who did not Reply?
8. **Data plane** — CEF, uRPF, PBR, asymmetry; adjacency ≠ forwarding.

## Show ladder (IPv4 classic names)

```text
show ip eigrp neighbors [detail]
show ip eigrp interfaces [detail]
show ip eigrp topology [active | <prefix>]
show ip route [eigrp | <prefix>]
show ip protocols
show ip eigrp events          ! if supported
show key chain                ! auth labs
```

## Debug discipline

- Prefer event log + targeted interface/neighbor debugs.
- Never start with unconstrained packet debug on large hubs.

## One-breath summary

“Neighbor, topology, RIB, FIB—then policy and query scope.”

---
