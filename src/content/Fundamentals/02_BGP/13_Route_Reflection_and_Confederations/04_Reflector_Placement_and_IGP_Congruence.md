# Route-Reflector Placement and IGP Congruence

If the RR's view of IGP cost differs from a client’s view, the RR may select and expose the wrong exit for that client. This is control-plane/data-plane non-congruence.

Good design considers:

- Reflectors located near the topology they represent.
- Redundant, failure-independent RRs.
- Stable loopback reachability.
- Consistent cluster policy.
- Capacity for update bursts and full path sets.
- Whether clients need per-site best paths.

The RR need not forward user traffic, but its topology perspective still influences forwarding choices. Treat reflector placement as a path-quality decision, not only a session-count decision.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
