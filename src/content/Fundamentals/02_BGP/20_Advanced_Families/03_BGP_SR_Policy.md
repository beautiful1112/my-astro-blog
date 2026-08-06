# BGP Advertisement of Segment-Routing Policies

BGP can distribute Segment Routing Policy candidates: a destination endpoint plus color identifies policy intent, while attributes carry candidate paths and segment lists.

This separates service intent from the IGP shortest path and supports centralized or distributed traffic engineering.

Validate:

- SR Policy SAFI capability.
- Color and endpoint matching.
- Candidate-path preference.
- Segment-list validity.
- Binding SID and forwarding installation.
- Behavior when a segment becomes unreachable.

RFC 9830, published in 2025, is the current BGP advertisement specification for SR Policies.

---

