# QoS and congestion

- Classify and mark at trusted boundaries.
- Reserve for peak bursts, not averages.
- Strict priority protects market data but can starve other traffic; bound and police admission.
- Protect PIM/IGMP control traffic during data congestion.
- ASIC drops may occur in shared buffers before obvious egress counters.
- Pause/PFC can convert loss into latency and head-of-line blocking; lossless Ethernet is not automatically better for UDP feeds.

