# Case: Bandwidth mis-set metric explosion

## Topology

```text
Campus -- Tunnel0 -- Remote
Tunnel0 inherits bandwidth 9 kbps (classic GRE leftover)
Physical underlay is 1 Gbps
```

## Symptom

Remote routes look absurdly far. Backup MPLS path with delay 10000 still wins over primary DMVPN. Variance meaningless. Some redistribute seed metrics “look tiny” beside tunnel paths.

## Evidence

```text
show interface Tunnel0 | include BW|Dly
! BW 9 Kbit/sec
show ip eigrp topology 10.8.0.0/16
! huge composite metric via tunnel
show interface GigabitEthernet0/0 | include BW
! BW 1000000 Kbit underlay (unused by EIGRP overlay metric)
```

## Root cause

EIGRP uses **configured interface bandwidth**, not measured underlay speed. BW=9 makes min-bandwidth catastrophic → metric explosion → wrong preference and harsh pacing implications.

## Fix

```text
interface Tunnel0
 bandwidth 100000
 delay 1000
!
show interface Tunnel0 | include BW|Dly
show ip eigrp topology 10.8.0.0/16
! metric collapses to design range
```

Align bandwidth/delay to the TE policy sheet for every tunnel. Re-check variance/FC after the change.

## Interview takeaway

“Always set tunnel bandwidth and delay for EIGRP—defaults like 9 kbps create metric explosions and false path choices.”

## Pacing side effect

With BW 9, even 50% bandwidth-percent is tiny—EIGRP pacing slows to a crawl and large topology exchanges struggle. Fixing bandwidth repairs both preference and control-plane throughput.

## Design sheet example

| Tunnel | bandwidth | delay | Intent |
|---|---|---|---|
| Primary DMVPN | 100000 | 1000 | Prefer |
| Backup DMVPN | 50000 | 2000 | FS eligible |
| MPLS GRE | 100000 | 1500 | Alternate |

Commit these numbers in NetBox/source-of-truth—not only in someone’s lab notes.

## Related

- [Unexpected Metrics](../20_Troubleshooting/07_Unexpected_Metrics.md)
- [Bandwidth Percent and Pacing](../17_WAN_NBMA_and_Tunnels/04_Bandwidth_Percent_and_Pacing.md)

---
