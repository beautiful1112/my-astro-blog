# Interview: What Is the Risk of Graceful Restart?

## Question

What problem can Graceful Restart introduce in a fast-failover environment?

## Strong answer

GR helpers may retain **stale** forwarding to a restarting speaker while its control plane (and possibly FIB) is not ready. Traffic can blackhole until stale timers expire—often longer than a hard failure that would have triggered an immediate backup path.

In low-latency trading edges, bounded stale timers, BFD+PIC with validated backup, or disabling GR on critical sessions may be preferable to preserving a dead next hop.

## Follow-ups

- GR vs long-lived GR / stale route controls?
- How do you measure loss interval in lab?
- Interaction with BFD?

## Cross-links

[GR stale case](../24_Practical_Cases/08_Graceful_Restart_Stale_Blackhole.md), [GR lab](../26_Labs/07_Graceful_Restart_vs_Hard_Failure.md).

---
