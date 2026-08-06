# Anycast with BGP

Anycast advertises the same prefix from multiple locations. Normal routing selects a “near” instance according to policy and topology.

Design requirements:

- Each site originates an identical, globally routable prefix.
- Health checks withdraw or deprefer unhealthy service instances.
- Stateful applications tolerate path changes or maintain locality.
- DDoS and capacity policy account for traffic shifts.
- Prefix length is accepted by upstreams.

Anycast proximity is routing proximity, not guaranteed geographic distance or lowest latency. During convergence, a flow can move to another site.

---

