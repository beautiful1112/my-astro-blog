# Dual stack design notes

Running EIGRP for IPv4 and IPv6 together should keep **failure domains, stub policy, and summaries aligned** so IPv6 is not a forgotten second protocol with worse SIA behavior.

## Design principles

1. **Same topology intent**: if a spoke is stub in IPv4, stub it in IPv6.
2. **Aligned summaries**: summarize corresponding IPv6 aggregates at the same hierarchy points as IPv4.
3. **RID consistency**: one RID identity per router across AFs reduces confusion.
4. **Timer/BFD parity**: mismatched hello/BFD between stacks causes one family to black-hole while the other looks fine.
5. **ACL parity**: v6 ACLs must permit EIGRP; copying only IPv4 ACL updates breaks IPv6 neighbors.

```text
[Edge]
* EIGRP IPv4 stub
* EIGRP IPv6 stub

[Distribution]
* IPv4 summary
* IPv6 summary

V4 --> S4
V6 --> S6
```

## Named vs classic dual-stack

Prefer **named mode** with both AFs under one process name for readable dual-stack configs. Classic dual-stack means maintaining `router eigrp` and `ipv6 router eigrp` in parallel—easy to drift.

## Redistribution caution

IPv6 redistribution (e.g. into BGP) is independent of IPv4. Tag and filter per family. Do not assume an IPv4 distribute-list protects IPv6.

## Traffic engineering

Variance/FC math is per-AF topology. An FS in IPv4 does not create an FS in IPv6. Validate both RIBs after link cuts.

## Cutover / migration tips

- Bring up IPv6 EIGRP in named AF beside a stable IPv4 classic/named process only with a documented neighbor and summary plan.
- Prefer finishing IPv4→named migration, then add ipv6 AF, rather than mixing three CLI styles.
- Monitor both `topology active` views during the first production flaps.

## Risks

- IPv6-only troubleshooting skills gap on the NOC → longer MTTR than IPv4 for the same DUAL event.
- Summarizing IPv4 but flooding IPv6 specifics through the core.
- Auth configured on IPv4 af-interface only.

## Interview framing

“Dual-stack EIGRP = two control planes. Mirror stub/summary/timers; prefer named AFs; test failover in both families.”

## Related

- [Named mode IPv6](03_Named_Mode_IPv6.md)
- [Designing the query domain](../09_Query_Scope_and_Convergence/06_Designing_the_Query_Domain.md)
- [Minimal working configs](../13_Named_Mode_and_Configuration/06_Minimal_Working_Configs.md)

---
