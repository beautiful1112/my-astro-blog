# Case: Aggressive BFD Causes Path Oscillation

## Scenario

BFD multipliers set extremely low on a microwave/exchange handoff. Microbursts cause BFD Down → BGP withdraw → traffic shifts → BFD Up → revert. Strategies see periodic loss; BGP prefix counters look “healthy” between events.

## Expected evidence

```text
show bgp ipv4 unicast neighbors <peer>
! flaps correlate with BFD
show logging | include BFD|BGP
! Down/Up pairs every N seconds
# Latency controller also toggles LP on the same interval → worse
```

## Config touchpoints

```text
! Relax BFD; fix Layer-1; add dampening/hysteresis to LP automation
neighbor 192.0.2.1 fall-over bfd
! bfd interval 300 min_rx 300 multiplier 5   ! example — validate platform
```

Disable performance-based LP changes during BFD instability. Prefer PIC on a stable primary over oscillating “optimal” path.

## Verification

BFD remains Up under load tests; VIP next hop stable for hours; loss interval under controlled fail meets SLO. See [Fast Failover vs Stability](../22_Quant_Trading_Networks/05_Fast_Failover_vs_Stability.md).

## Lesson

Detection speed without hysteresis becomes self-inflicted churn.
## Cross-links

Use the matching troubleshooting or interview note if this case appears in an incident; keep evidence (show output + probe) with the ticket.

---
