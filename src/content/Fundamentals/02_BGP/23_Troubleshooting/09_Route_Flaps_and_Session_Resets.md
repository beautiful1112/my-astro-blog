# Route Flaps and Session Resets

Separate:

- Physical link flaps.
- TCP/session resets.
- BFD events.
- Policy-driven withdrawals.
- Next-hop/IGP changes.
- Route-reflector best-path oscillation.
- Peer update churn.

For session resets, collect the last reset reason and NOTIFICATION code before clearing anything. For route churn, identify whether the NLRI, next hop, or only an attribute changed.

Correlate both peers, interface counters, BFD, CPU, control-plane policers, and update rate on one timeline.

---

