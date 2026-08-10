# Debugging multicast microbursts

Minute averages hide sub-millisecond congestion. Microbursts create sequence gaps while utilisation graphs look calm.

Correlate:

- exchange/application sequences;
- ingress and egress hardware timestamps;
- switch queue watermarks and drops;
- NIC missed/no-buffer/descriptor counters;
- kernel UDP and socket drops;
- application scheduling pauses, page faults, and GC;
- A/B gaps: one-line loss suggests a path issue, while identical loss on both suggests shared infrastructure.

Related: [Capacity math](../12_Quant_Trading_Market_Data/05_Capacity_Math.md), [QoS](../12_Quant_Trading_Market_Data/06_QoS_and_Congestion.md), [Host tuning](../11_Host_and_Application/06_Low_Latency_Host_Tuning.md), [False sequence gap](../16_Practical_Cases/10_False_Sequence_Gap.md).

## Correlation matrix

| Observation | Points to |
|---|---|
| Gaps on A only | A path / NIC / fabric |
| Identical gaps A and B | Shared exchange, arb host, or false diversity |
| NIC missed rises | Ring / IRQ / DMA |
| UdpRcvbufErrors | Socket / app drain |
| Switch egress drops on MD class | QoS / replication / shallow buffer |
| Quiet NIC, quiet switch, app gap | Decoder / scheduling / “false gap” |

## Configuration patterns

### Linux host during an event

```text
ethtool -S eth0 | egrep -i 'miss|drop|buffer|fifo'
nstat -az | egrep 'Udp|Rcvbuf|InDiscards'
cat /proc/net/softnet_stat
mpstat -P ALL 1
tcpdump -ni eth0 -tt 'udp and dst host 232.10.10.10'
```

### Cisco / Nexus-style (vendor varies)

```text
show policy-map interface Ethernet1/1
show interface Ethernet1/1 counters errors
show queuing interface Ethernet1/1
show ip mroute 192.0.2.10 232.10.10.10 count
```

### Induce controlled burst (lab)

```text
# Sequenced generator: 50us ON / 950us OFF at peak pps
# Compare watermarks vs continuous average at same Mbps
```

## Interactions

| Mechanism | Relationship |
|---|---|
| **Strict priority** | Helps until policer/admit limit |
| **PFC** | Delays instead of drops—check latency SLO |
| **LAG pin** | One member microbursts first |

## Verification checklist

- [ ] Sub-ms or watermark telemetry enabled  
- [ ] A vs B gap comparison  
- [ ] NIC + UDP + app counters time-aligned  
- [ ] QoS drop counters on replication edges  
- [ ] One knob changed (ring / police / affinity)  

Lab: [Host bottleneck](../18_Labs/07_Host_Bottleneck.md).

## Risks

- Raising averages-based capacity after a burst incident.
- Blaming the exchange when both lines share one leaf.
- Fixing “gaps” only with huge `SO_RCVBUF` (staleness).

## Interview framing

“Debug microbursts with synchronized sequences and high-resolution drop/watermark counters across switch, NIC, socket, and app—averages will lie.”

---
