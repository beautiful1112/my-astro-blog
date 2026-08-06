# Market-Data vs Order-Path Policy

Market data and order entry can require different routing behavior.

Market data often emphasizes:

- High fan-out.
- Loss and gap detection.
- Redundant feeds.
- Multicast distribution inside the site.

Order paths often emphasize:

- Deterministic low latency.
- Stable return path and stateful controls.
- Strict destination authorization.
- Small, known prefix sets.

Use separate VRFs, communities, prefix policy, queues, and monitoring where appropriate. Do not let a bulk Internet or recovery-feed route unexpectedly become preferred for order traffic.

---

