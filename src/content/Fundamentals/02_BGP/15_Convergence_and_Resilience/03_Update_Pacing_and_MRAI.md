# Update Pacing and MRAI

The Minimum Route Advertisement Interval concept limits how frequently advertisements for a destination are sent to a peer. Implementations differ in defaults, per-peer versus per-prefix behavior, batching, and withdrawal handling.

Pacing reduces churn but can delay visibility of a better route. During convergence, path exploration may generate several intermediate AS paths before the final path is known.

Do not memorize one universal timer value. Inspect the actual platform, address family, and eBGP/iBGP behavior.

Operationally, correlate update timestamps with detection, best-path changes, and FIB installation to identify whether delay comes from BGP pacing or another layer.

---

