# Low-latency host considerations

Host tuning for market-data multicast trades loss, latency, and jitter. Larger buffers reduce reported drops while increasing staleness; interrupt coalescing raises throughput while batching delay.

## Levers

| Lever | Helps | Cost |
|---|---|---|
| **RX rings** | Absorb microbursts | Queueing / staleness if oversized |
| **SO_RCVBUF** | Survive scheduling pauses | Same—latency hiding |
| **RSS / RPS / XPS** | Parallelism | One flow may still pin one queue |
| **Interrupt moderation** | CPU efficiency | Batching jitter |
| **CPU affinity / NUMA** | Stable cache locality | Mis-pinning hurts |
| **C-states / freq** | Power | Wake-up jitter |
| **GRO / LRO** | Throughput | Hides packet boundaries in captures |
| **Busy poll / busy poll socket** | Lower wake latency | CPU burn; kernel support required |

Kernel-bypass (AF_XDP, DPDK) changes the monitoring surface; their counters become authoritative. Related: [NIC receive path](05_NIC_Receive_Path.md), [Loss vs latency](../12_Quant_Trading_Market_Data/04_Loss_vs_Latency.md).

## Ring buffers

```text
ethtool -g eth0
ethtool -G eth0 rx 4096
```

Increase until `rx_missed` / `rx_no_buffer` stop rising under realistic bursts, then stop. Excess depth without matching application drain only delays the gap.

## Socket receive buffer

```text
# Process
setsockopt(fd, SOL_SOCKET, SO_RCVBUF, &bytes, sizeof(bytes));
# Ceiling (example)
sysctl -w net.core.rmem_max=16777216
sysctl -w net.core.rmem_default=4194304
```

Verify the **effective** size after kernel doubling rules (`getsockopt` SO_RCVBUF). Watch `UdpRcvbufErrors` / `RcvbufErrors`.

## Busy poll notes

Linux busy polling (e.g. `SO_BUSY_POLL`, `busy_poll` sysctl, or driver-specific busy wait) can reduce interrupt wake latency for a dedicated core:

```text
# Conceptual — confirm kernel/docs for your release
sysctl -w net.core.busy_poll=50
sysctl -w net.core.busy_read=50
# setsockopt SO_BUSY_POLL on the socket where supported
```

Use only on pinned CPUs with a clear power/thermal budget. Busy poll does not fix an undersized ring or a slow decoder.

## Configuration patterns

```text
# Pin IRQ / queue to isolated CPU (sketch)
ethtool -N eth0 rx-flow-hash udp4 sdfn
# systemctl / tuned: cpu-partitioning, disable deep C-states on feed cores
# Prefer hardware RX timestamping when correlating A/B skew
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **QoS / pause** | Lossless Ethernet can add latency instead of drops |
| **PTP** | Align host clock before comparing line skew |
| **Hypervisor** | Steal time invalidates tight busy-poll assumptions |

## Verification

Change **one** knob per test. Record:

```text
peak pps, gap count, p99 ingress-to-book, NIC missed, UdpRcvbufErrors, CPU
```

```text
ethtool -S eth0
nstat -az | egrep 'Udp|Rcvbuf'
perf stat -e cpu-clock,context-switches -p <pid>
```

## Risks

- Copying “max everything” from a throughput blog into a latency path.
- Enabling busy poll on shared cores with GC or other feeds.
- Forgetting that bypass stacks ignore `SO_RCVBUF`.

## Interview framing

“Rings and `SO_RCVBUF` buy burst absorption at the cost of queueing delay; busy poll and affinity cut wake latency on dedicated cores—tune against gaps **and** staleness, not drops alone.”

---
