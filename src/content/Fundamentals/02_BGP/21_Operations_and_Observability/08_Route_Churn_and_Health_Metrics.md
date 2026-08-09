# Route Churn and BGP Health Metrics

A stable FSM can still carry pathological churn; a stable best path can still blackhole.

## Metrics worth baselining (per peer / family)

- Session state transitions and last reset reason / NOTIFICATION.
- Accepted and advertised prefix counts (absolute and rate of change).
- UPDATE / withdrawal rate and peak RIB churn.
- Soft-reconfig memory pressure and route-refresh frequency.
- Queue depth, slow-peer detection, and UPDATE generation lag.
- RIB→FIB programming latency for critical prefixes.
- RPKI validator / RTR session health and Invalid count.
- Best-path and next-hop change rate for VIP prefixes (order gateways, MD endpoints).
- Flaps of TE attributes (AIGP, link-bandwidth, steering communities).

## Alerting philosophy

Alert on **deviation from that peer’s baseline**, not one global churn threshold. A full-table transit peer and a /24 exchange feed have different normals.

Correlate control-plane churn with data-plane SLIs (loss, one-way latency). Oscillation from aggressive BFD or performance-driven LOCAL_PREF is often a policy problem—see [Fast BFD oscillation case](../24_Practical_Cases/12_Fast_BFD_Causes_Path_Oscillation.md).

## Example VIP watch

```text
# Conceptual: alert if best next-hop for order VIP changes > N/hour
# or if AIGP / LOCAL_PREF on that prefix changes without a change ticket
```

## Suggested SLO-style thresholds (tune per peer)

| Signal | Example trigger |
|---|---|
| Prefix count | ±10% vs 7-day baseline in 5 minutes |
| Best-path VIP | Any change outside change window |
| UPDATE rate | >N× baseline for 2 minutes |
| RTR session | Down > 60s |
| Invalid count | Step increase > M |

Document thresholds next to the peer class (transit vs exchange vs PE-CE).

Track both “path changed” and “path unchanged but FIB unresolved / blackhole.” Pair with [Safe BGP Change Workflow](09_Safe_BGP_Change_Workflow.md) abort thresholds.

---
