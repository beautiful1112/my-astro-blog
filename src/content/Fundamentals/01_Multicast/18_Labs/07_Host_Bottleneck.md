# Lab 7: Host bottleneck

Locate drops on the host receive path under high-pps bursts.

## Topology

```text
Burst generator 192.0.2.10 -> switch -> receiver NIC eth0
External TAP optional for ground truth sequences
```

Group `232.10.10.10`, port `15000`, small payloads for max pps.

## Objectives

- Compare TAP/capture sequence vs NIC vs kernel vs socket vs app.
- Change one tuning knob at a time.

## Config touchpoints

```text
ethtool -g eth0
ethtool -G eth0 rx <N>
setsockopt SO_RCVBUF
ethtool -C eth0 rx-usecs <N>
# CPU affinity / irqbalance off for feed core
```

## Tasks

1. Generate short high-pps bursts with sequences.
2. Record TAP (or SPAN) sequence continuity.
3. Record `ethtool -S`, `nstat`, socket drops, app gaps, `mpstat`.
4. Change ring size; retest.
5. Change `SO_RCVBUF`; retest.
6. Change interrupt moderation; retest.
7. Pin IRQ and app to one isolated core; retest.

## Failure injection

- Concurrent `tcpdump -s 0` on the receive CPU (capture-induced loss).
- Enable deep C-states; observe jitter.
- Second process with `SO_REUSEPORT` stealing packets.

## Expected evidence

```text
Identify first rising counter that explains app gaps
Larger rings reduce nic_missed but may raise latency
Busy app without buffer → UdpRcvbufErrors
```

```text
ethtool -S eth0
nstat -az | egrep 'Udp|Rcvbuf'
cat /proc/net/softnet_stat
tcpdump -ni eth0 -tt 'udp and dst host 232.10.10.10'
```

## Cross-links

[NIC receive path](../11_Host_and_Application/05_NIC_Receive_Path.md), [Host tuning](../11_Host_and_Application/06_Low_Latency_Host_Tuning.md), [Capture vs app gaps](../16_Practical_Cases/06_Capture_Sees_Data_Application_Gaps.md), [Microbursts](../15_Troubleshooting/06_Microburst_Debugging.md).

---
