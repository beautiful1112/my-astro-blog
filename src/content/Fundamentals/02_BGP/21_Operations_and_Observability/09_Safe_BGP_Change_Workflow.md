# Safe BGP Change Workflow

Before a BGP policy change:

1. State the intended received, selected, and advertised route deltas.
2. Snapshot peer state, prefix counts, exact paths, and traffic.
3. Validate policy offline against representative routes.
4. Confirm rollback syntax and access path.
5. Apply to one bounded peer/family where possible.
6. Use route refresh or soft policy re-evaluation instead of a hard reset.
7. Verify external observations and forwarding.

Avoid **clear bgp all** as a routine policy tool. It disrupts unrelated families and peers.

For high-value trading paths, schedule around market activity and define abort thresholds for loss, latency, route count, and convergence.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
