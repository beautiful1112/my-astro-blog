# Aggregation and Discard Routes

An aggregate reduces routing state by advertising a covering prefix. A common implementation installs a high-administrative-distance static route to a discard interface and originates the aggregate only when policy conditions are met.

Why the discard route matters: if no component route matches, traffic attracted by the summary must terminate rather than follow a default route and loop.

Design choices:

- Always advertise the aggregate or require a contributor.
- Advertise component routes as well or suppress them.
- Preserve or replace path attributes.
- Attach ATOMIC_AGGREGATE/AGGREGATOR when appropriate.

Test partial failure: a summary can remain reachable while one component destination is not.

---

