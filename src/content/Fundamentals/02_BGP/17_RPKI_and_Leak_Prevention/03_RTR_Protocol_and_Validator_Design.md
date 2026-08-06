# RPKI-to-Router Protocol and Validator Design

The RPKI-to-Router (RTR) protocol lets a router retrieve validated prefix-origin data from a cache. The cache performs repository synchronization and cryptographic validation; the router performs fast route comparison.

Design for:

- At least two independent validator instances.
- Controlled repository connectivity and monitoring.
- Serial/incremental update handling.
- Expiry and stale-cache policy.
- Router session authentication or protected management paths where supported.
- Alerting on large VRP changes.

Validator availability and RPKI data validity are separate. A cache can be reachable yet stale or incomplete.

---

