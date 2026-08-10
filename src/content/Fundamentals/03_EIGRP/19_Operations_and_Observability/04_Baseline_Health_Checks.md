# Baseline health checks

Baselines make anomalies obvious. Capture them after every major design change and on a weekly ops cadence for WAN hubs.

## Neighbor health

| Check | Healthy sign |
|---|---|
| Neighbor count | Matches inventory |
| Uptime | Long-lived; not resetting hourly |
| Q count | Usually 0 |
| SRTT/RTO | Stable, not climbing with load |
| Stub flags | Spokes show stub |

```text
show ip eigrp neighbors detail
```

## Topology / RIB health

| Check | Healthy sign |
|---|---|
| Prefix count | Near baseline ± expected |
| Active prefixes | None lingering |
| SIA events | None in logs |
| D vs D EX mix | Matches redistribution design |

```text
show ip eigrp topology summary
show ip route summary
show ip eigrp topology active
```

## Interface health

```text
show ip eigrp interfaces detail
show interface Tunnel0 | include error|drop|BW|Dly
```

Confirm bandwidth/delay still match the design sheet after hardware swaps.

## Control-plane load

```text
show ip eigrp traffic
show processes cpu sorted | include EIGRP|IP Input
```

Sudden hello/update spikes after a change → query storm or flapping link.

## Baseline template (store in change ticket)

```text
Date / device / AS:
Neighbors: N=__  stubs=__
Topology prefixes: __
RIB eigrp routes: __
Active: __
Auth mode: __
Summary prefixes: __
Last SIA: __
```

## Interview framing

“Baseline neighbor counts, prefix counts, and zero Active/SIA—so the next incident has a known-good reference.”

## Related

- [Essential Show Commands](01_Essential_Show_Commands.md)
- [Logging and Change Control](05_Logging_and_Change_Control.md)
- [Hub-Spoke WAN Checklist](../17_WAN_NBMA_and_Tunnels/06_Hub_Spoke_WAN_Checklist.md)

---
