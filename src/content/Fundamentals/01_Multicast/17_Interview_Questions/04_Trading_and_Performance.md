# Interview questions: trading and performance

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

**Why UDP multicast instead of TCP?** Efficient one-to-many delivery without sender state per receiver or TCP head-of-line blocking; applications recover loss.

**How do A/B feeds help?** Earliest-copy arbitration uses the other independent line to fill path-specific gaps.

**How do you locate a gap?** Compare the same sequence at ordered, time-synchronized observation points and correlate drop counters.

**Why is average bandwidth insufficient?** Small packets and microbursts exhaust pps, buffers, queues, and CPU.

**Can a larger buffer hurt?** Yes; it can replace visible loss with stale-data latency.

**Why avoid fragmentation?** One missing fragment loses the datagram, while reassembly adds state and latency.

