# Deterministic path and host tuning

## Deterministic path

Use cut-through switching where justified, shallow and controlled queues, explicit QoS, diverse A/B fibers, and measured failover.

The path is a design object: fiber diversity, queue class, and failover that does not silently rehash onto a slower ECMP member.

## Host tuning

Align IRQs, RSS queues, CPU pinning, NUMA locality, huge pages, and busy polling with the application design. OpenOnload accelerates sockets; DPDK uses poll-mode user-space I/O.

Network design that ignores the host stack is measuring the wrong system.

## Capture points

Timestamp at ingress before processing, after normalization, and at a representative subscriber. Monitor sequence loss separately from packet counters.

## Related

- [Latency distribution](01_Latency_Distribution.md)
- [PTP time distribution](03_PTP_Time_Distribution.md)
- [Low-latency multicast design pattern](../../01_Multicast/12_Quant_Trading_Market_Data/08_Low_Latency_Design_Pattern.md)

---
