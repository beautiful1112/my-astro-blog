# Loss versus latency in trading

A very large receive buffer may reduce reported packet loss while delivering events too late to trade. Measure correctness, loss, tail latency, and staleness separately.

Useful metrics include sequence gaps per line and after arbitration, A/B first-arrival skew, NIC/ring/socket/application drops, ingress-to-book latency, recovery time, duplicates, out-of-order packets, peak pps, microbursts, and stale-book duration.

## Two failure modes

| Mode | Symptom | Trading impact |
|---|---|---|
| Hard loss | Sequence gap, recovery or stale | Missed/incorrect book |
| Soft delay | Continuous sequences, high latency | Stale quotes, bad decisions |
| Hidden loss | Huge buffers then burst release | Both—delayed then gap storm |

Related: [Host tuning](../11_Host_and_Application/06_Low_Latency_Host_Tuning.md), [Microburst debugging](../15_Troubleshooting/06_Microburst_Debugging.md).

## Metric set (minimum)

```text
gaps_line_a / gaps_line_b / gaps_after_arb
dup_count / reorder_count
nic_missed / udp_rcvbuf_errors / app_drop
p50/p99/p999 ingress_hw_ts -> book_ts
skew_ab_us
recovery_rtt_ms / snapshot_duration_ms
stale_ms / stale_events
peak_pps / burst_bytes_1ms
```

## Configuration patterns

Tune for the **objective**:

```text
# Loss-sensitive lab: larger ring + SO_RCVBUF
ethtool -G eth0 rx 4096
setsockopt SO_RCVBUF 16MB

# Latency-sensitive prod: sized rings, busy poll, stale timer hard fail
stale_after_ms=50
# Do not raise buffers to "fix" a capacity problem
```

### Switch — queue visibility beats average utilisation

```text
! Vendor-specific: enable queue watermark / drop counters on MD class
show interfaces <if> counters errors
show policy-map interface <if>
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Strict priority QoS** | Protects latency until admission is exceeded |
| **PFC / pause** | Converts loss into delay—measure both |
| **A/B arb** | Hides one-line loss; does not fix shared delay |

## Verification

1. Induce 1 ms congestion: compare gap counters vs p99 latency.
2. Double `SO_RCVBUF`: gaps down, p99 up? Record both.
3. Confirm stale rule fires when recovery exceeds budget.

```text
ethtool -S eth0
nstat -az | grep Udp
# app histograms for ingress->book
```

## Risks

- Optimising only “zero gaps” in nightly reports.
- Comparing software timestamps across unsynchronised hosts.
- Declaring victory from average Mbps headroom.

## Interview framing

“In trading, a buffer that eliminates gaps can still lose money via staleness—report loss, tail latency, and stale duration as separate SLOs.”

---
