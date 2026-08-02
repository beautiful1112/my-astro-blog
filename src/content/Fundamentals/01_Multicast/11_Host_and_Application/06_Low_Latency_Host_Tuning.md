# Low-latency host considerations

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- **RX rings:** absorb bursts but excessive depth can hide queueing/staleness.
- **Socket buffer:** protects scheduling pauses but can add latency.
- **RSS/RPS/XPS:** a single flow may concentrate on one queue.
- **Interrupt moderation:** improves throughput but adds batching/jitter.
- **CPU affinity/NUMA:** align NIC queue, polling thread, memory, and decoder.
- **Power management:** C-states and frequency changes add jitter.
- **GRO/LRO:** understand packet aggregation and capture effects.
- **Timestamping:** distinguish NIC hardware, kernel software, and application timestamps; synchronize with PTP.

Kernel-bypass APIs such as AF_XDP or DPDK change the monitoring surface; their own counters become authoritative.

