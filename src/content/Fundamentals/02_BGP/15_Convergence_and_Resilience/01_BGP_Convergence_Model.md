# BGP Convergence Model

BGP convergence is the time from a topology or policy change until relevant speakers select and install a stable replacement path.

The sequence can include:

1. Failure detection.
2. Session or next-hop invalidation.
3. Path withdrawal or replacement.
4. Policy and best-path recomputation.
5. Advertisement propagation.
6. Main-RIB and forwarding-table programming.

Control-plane convergence and data-plane recovery are not identical. Prefix Independent Convergence may repair forwarding before BGP finishes propagating, while a stale next hop can leave BGP apparently stable but traffic broken.

Measure the user-visible loss interval, not only the BGP log timestamps.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
