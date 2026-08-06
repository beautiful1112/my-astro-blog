# Route Churn and BGP Health Metrics

Track:

- Session state changes and reset reason.
- Accepted and advertised prefix counts.
- UPDATE and withdrawal rate.
- RIB and FIB programming latency.
- Queue depth and slow-peer state.
- Route-refresh events.
- RPKI validator/cache health.
- Best-path and next-hop changes for critical prefixes.

A stable session can still carry extreme churn. A stable best path can still point to a failing data path.

Baseline per peer and family. Alert on deviations from the peer's own normal behavior rather than one global threshold.

---

