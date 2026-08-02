# Latency-Aware Path Control

AS_PATH length, IGP cost, and geographic distance are imperfect latency proxies. Directly measure:

- One-way latency with synchronized clocks where possible.
- Round-trip latency.
- Jitter and loss.
- Queueing under load.
- Failover loss interval.

Map measurement results into stable policy classes rather than changing LOCAL_PREF on every small sample. Use hysteresis, minimum hold periods, and hard safety constraints.

Separate market-data ingestion, order entry, and bulk traffic policies; their tolerance for loss, asymmetry, cost, and churn differs.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
