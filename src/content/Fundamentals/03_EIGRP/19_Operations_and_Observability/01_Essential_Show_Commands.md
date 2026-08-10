# Essential show commands

Operators should move from **neighbors → topology → RIB → interfaces → traffic** without improvising random debugs.

## Neighbor layer

```text
show ip eigrp neighbors
show ip eigrp neighbors detail
show eigrp address-family ipv4 neighbors
```

Read: uptime, SRTT, RTO, Q count, sequence. Rising Q or retransmits → congestion or MTU issues.

## Topology layer

```text
show ip eigrp topology
show ip eigrp topology <prefix>/<len>
show ip eigrp topology active
show ip eigrp topology all-links
```

`all-links` shows paths that failed FC (important for variance troubleshooting).

## RIB / protocols

```text
show ip route eigrp
show ip route <prefix>
show ip protocols
```

Confirm AD/metric `[90/…]` vs `[170/…]` and that the RIB next-hop matches successor.

## Interfaces and metrics

```text
show ip eigrp interfaces
show ip eigrp interfaces detail
show interface <if> | include BW|Dly
```

## Traffic and events

```text
show ip eigrp traffic
show ip eigrp events
show ip eigrp timers
```

## Named-mode equivalents

Prefer `show eigrp address-family ipv4 …` on named processes; classic `show ip eigrp` still appears on many trains.

## Quick triage map

| Question | Command |
|---|---|
| Peer up? | `show ip eigrp neighbors` |
| Prefix known? | `show ip eigrp topology P` |
| Why not FS? | `topology all-links` + FD/AD compare |
| Installed? | `show ip route P` |
| Active/SIA? | `topology active` + events |
| Auth/BW? | `interfaces detail` |

## Interview framing

“Triage with neighbors, topology (and all-links), then RIB—debug only after the failing layer is identified.”

## Related

- [EIGRP Event Log](02_EIGRP_Event_Log.md)
- [Troubleshooting Framework](../20_Troubleshooting/01_Troubleshooting_Framework.md)
- [Baseline Health Checks](04_Baseline_Health_Checks.md)

---
