# ATOMIC_AGGREGATE and AGGREGATOR

Aggregation can discard path detail from contributing routes.

- **ATOMIC_AGGREGATE** warns that a less-specific advertisement may have lost path information and that receivers should not deaggregate it based on partial knowledge.
- **AGGREGATOR** optionally identifies the ASN and router that formed the aggregate.

Modern networks often create an aggregate from a static discard route and advertise it under explicit policy. The discard prevents a forwarding loop when traffic matches the aggregate but no component route exists.

Aggregation improves scale and stability, but it can hide component failures and attract traffic for unreachable subprefixes. Validate both control-plane advertisement and data-plane behavior for holes inside the summary.

---

