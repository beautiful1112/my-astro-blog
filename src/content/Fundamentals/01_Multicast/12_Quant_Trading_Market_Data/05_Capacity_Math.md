# Multicast capacity math

Do not size only by average Mbps.

```text
pps ≈ bit rate / (on-wire frame size × 8)
```

Include preamble/SFD, inter-packet gap, FCS, VLAN tags, and encapsulation as appropriate. Small packets can exhaust pps/CPU before bandwidth.

Replication makes egress critical: a 2 Gb/s input copied to 20 ports consumes roughly 40 Gb/s aggregate egress.

```text
queue growth bytes ≈ (aggregate ingress - egress rate) × burst duration / 8
```

This is a lower bound when buffers are shared or internal replication adds contention.

## Worked examples

| Scenario | Math | Bottleneck |
|---|---|---|
| 5 Gb/s of 100-byte frames | ~5e9 / (100×8) ≈ 6.25 Mpps | PPS / CPU / ASIC |
| 5 Gb/s of 1000-byte frames | ~0.625 Mpps | Often bandwidth |
| 2 Gb/s × 20 OIL ports | ~40 Gb/s fabric egress | Replication tax |
| 50 µs burst at +10 Gb/s over egress | ~62.5 KB queue | Shallow buffer drop |

Related: [QoS](06_QoS_and_Congestion.md), [LAG and ECMP](07_LAG_and_ECMP.md).

## On-wire size reminder

```text
L2 frame ≈ preamble/SFD + eth + vlan? + payload + FCS + IPG
Use vendor "packet size" definitions consistently (L2 vs L3)
```

## Configuration patterns

### Admission / capacity guard (Cisco sketch)

```text
class-map match-all MD-FEED
 match access-group name ACL-MD
!
policy-map MD-INGRESS
 class MD-FEED
  police cir 3000000000 bc 6250000
  priority level 1
```

Police **admission** at the edge so core strict-priority cannot starve control planes unbounded.

### Linux host budget

```text
# peak pps test with sequenced generator; watch
ethtool -S eth0
mpstat -P ALL 1
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **IGMP snooping** | Limits fan-out to interested ports—still size those ports |
| **MFIB** | Hardware replication vs recirculation changes effective pps |
| **Host NIC** | Per-queue pps limits under RSS pin |

## Verification

1. Lab: generate known pps at min frame size; note first counter to rise.
2. Measure 1 ms and 100 µs burst watermarks, not 1-minute averages.
3. Fail one OIL member and recompute remaining fan-out capacity.

```text
show interfaces <if> rates
show policy-map interface <if>
```

## Risks

- Sizing from “average busy hour” graphs.
- Ignoring replication when quoting a single uplink number.
- Assuming LAG aggregate equals one `(S,G)` capacity.

## Interview framing

“Multicast capacity is peak pps and burst queueing under replication—average Mbps and LAG sums systematically understate risk.”

---
