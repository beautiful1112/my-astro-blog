# Loss versus latency in trading

A very large receive buffer may reduce reported packet loss while delivering events too late to trade. Measure correctness, loss, tail latency, and staleness separately.

Useful metrics include sequence gaps per line and after arbitration, A/B first-arrival skew, NIC/ring/socket/application drops, ingress-to-book latency, recovery time, duplicates, out-of-order packets, peak pps, microbursts, and stale-book duration.

