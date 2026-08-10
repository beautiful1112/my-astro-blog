# Neighbor flaps

Adjacency forms then dies repeatedly. Focus on **holdtime expiry**, retransmission, and one-way hellos under loss or CPU pressure.

## Common causes

| Cause | Clues |
|---|---|
| Link errors / congestion | Interface CRC, drops; Q count rises |
| QoS dropping proto 88 | Flaps under load only |
| Undersized `bandwidth` + pacing | EIGRP starved or hellos delayed |
| Unstable tunnel / NHRP | DMVPN flaps correlate |
| Auth lifetime boundary | Flap at clock-aligned time |
| Debug / high CPU | Process starved |
| MTU blackhole | Large updates fail; neighbor dies |

## Evidence

```text
show ip eigrp neighbors detail
! SRTT, RTO, Q count, retransmits
show interface <if>
show ip eigrp traffic
show logging | include peer|down|hold
show processes cpu sorted
```

Event log: neighbor down reasons and timing vs traffic peaks.

## Stabilization pattern

1. Fix Layer 2 / tunnel stability first.
2. Protect EIGRP in QoS (priority/policer exceptions carefully).
3. Correct interface bandwidth/delay; tune `bandwidth-percent` only after.
4. Eliminate chronic packet debug.
5. For NBMA, confirm static neighbors and maps.

## Hold and hello

Increasing hello/hold can mask loss but slows failure detection—prefer fixing the path. BFD (where supported with EIGRP) is a cleaner fast-detect option than tiny hellos on congested links.

## Interview framing

“Flaps are holdtime and reliability problems—check Q count, interface errors, QoS, and tunnel stability before redesigning metrics.”

## Correlation worksheet

```text
Flap time: ____
Interface errors delta: ____
CPU at flap: ____
QoS drops proto 88: ____
Tunnel/NHRP state: ____
Auth lifetime boundary?: ____
Debug enabled?: ____
```

## Temporary relief vs real fix

Raising hold timers or `bandwidth-percent` can reduce flaps while you schedule underlay repair—but record them as debt. Permanent design still needs clean links, QoS protection, and correct bandwidth.

## Related

- [Bandwidth Percent and Pacing](../17_WAN_NBMA_and_Tunnels/04_Bandwidth_Percent_and_Pacing.md)
- [DMVPN and Tunnel Notes](../17_WAN_NBMA_and_Tunnels/05_DMVPN_and_Tunnel_Notes.md)
- [Baseline Health Checks](../19_Operations_and_Observability/04_Baseline_Health_Checks.md)

---
