# Maximum-Prefix and Resource Protection

Set maximum-prefix limits per peer and AFI/SAFI based on expected route count, growth, and failure mode.

Options commonly include:

- Warning threshold.
- Session teardown.
- Route discard while preserving session.
- Automatic restart after a delay.
- Administrative recovery requirement.

Also monitor UPDATE rate, attribute size, path count, and memory. A malicious or broken peer can consume resources without exceeding a simple prefix count.

For a default-only peer, a threshold of hundreds is already suspicious; for a full Internet table, the threshold needs measured headroom and regular review.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
