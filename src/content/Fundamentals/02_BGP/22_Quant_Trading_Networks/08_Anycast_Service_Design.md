# Anycast for Trading-Support Services

Anycast can distribute stateless supporting services such as DNS, telemetry collectors, or selected API endpoints. It is less suitable for stateful sessions that cannot tolerate a site change.

Health withdrawal should reflect real service readiness, not merely interface status. Consider:

- Local application probe.
- Dependency health.
- Drain time.
- Route aggregation behavior.
- Minimum advertisement interval.
- Capacity at the next-nearest site.

When one site withdraws, traffic shifts according to external policy and may overload another region. Test the full redistribution event.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
