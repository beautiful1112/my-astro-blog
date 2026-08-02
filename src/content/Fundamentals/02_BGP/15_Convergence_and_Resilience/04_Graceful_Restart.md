# BGP Graceful Restart

RFC 4724 lets a restarting speaker ask peers to retain routes temporarily while its control plane restarts. The forwarding plane is expected to keep forwarding.

The peer marks retained routes stale, waits for the restarting speaker to re-advertise families, and removes routes not refreshed by End-of-RIB processing or timer expiry.

Risk: if forwarding did not survive, retained stale routes create a blackhole. GR therefore trades faster control-plane continuity for possible stale forwarding.

Validate:

- Restart capability and family flags.
- Forwarding-state preservation.
- Stale and restart timers.
- Behavior during process restart, supervisor switchover, and complete device failure.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
