# A/B line arbitration

```text
Expected=100
A:100 -> process; Expected=101
B:100 -> duplicate; discard
B:101 -> process; Expected=102
A:103 -> buffer; gap at 102
B:102 -> process; then process buffered 103
```

The handler needs session/channel identity, wrap/reset rules, a bounded reorder window, duplicate detection, gap timers, recovery quotas, snapshot thresholds, and deterministic handling when replay overlaps live traffic.

Two feeds are useful only when failure domains are independent. Different groups on one switch, fiber, NIC queue, or CPU are not true end-to-end diversity.

## Independence checklist

| Layer | Separate A/B? |
|---|---|
| Exchange publisher / NIC | |
| Cross-connect / metro | |
| Spine/leaf fabric | |
| Last-hop switch | |
| Server NIC / PCIe root | |
| RX queue / CPU core | |
| Power / optics vendor (ideal) | |

Related: [A/B feeds fail together](../16_Practical_Cases/07_AB_Feeds_Fail_Together.md), [Application reliability](../11_Host_and_Application/08_Application_Reliability.md).

## Arbitration rules (minimal)

1. Track `expected` per session.
2. Accept earliest valid copy; drop duplicates.
3. Hold out-of-order within a small window.
4. On gap timer: request rewind or mark for snapshot.
5. Never invent sequences; fail to stale if unrepaired.

## Configuration patterns

### Dual-NIC Linux joins

```text
# NIC A
IP_ADD_MEMBERSHIP 232.10.10.10 if 198.51.100.10
# NIC B
IP_ADD_MEMBERSHIP 232.10.10.11 if 198.51.101.10
```

### QoS — do not share one oversubscribed uplink policer for both “diverse” lines

```text
class-map match-any MD-A
 match access-group name ACL-MD-A
class-map match-any MD-B
 match access-group name ACL-MD-B
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **LAG** | Two members ≠ two feeds if both lines hash together |
| **PTP** | Skew metrics need comparable timestamps |
| **GC / batching** | App pause looks like dual-line loss |

## Verification

1. Delay A by 100 µs—B wins; no gaps after arb.
2. Drop A packets—B fills; `gaps_a` rises, `gaps_arb` flat.
3. Drop same sequences on A and B—recovery path engages.
4. Fail shared switch—both lines gap together (proves false diversity).

```text
# Metrics
skew_ab_us, gaps_a, gaps_b, gaps_after_arb, dups_dropped
```

## Risks

- Unbounded reorder buffers (latency hiding).
- Treating VLAN-only separation as path diversity.
- Replay inserting duplicates that corrupt `expected`.

## Interview framing

“A/B arbitration takes the earliest good sequence from independent lines; without failure-domain diversity you only have two copies of the same risk.”

---
