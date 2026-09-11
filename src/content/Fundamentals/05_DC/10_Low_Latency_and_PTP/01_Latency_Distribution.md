# Latency distribution

Track P50, P99, and P99.9 across the exchange handoff, switching path, NIC, kernel or bypass stack, and application.

1. **Exchange** — packet timestamp
2. **Layer 1 / FPGA** — fan-out and capture
3. **NIC** — RX queue and hardware timestamp
4. **Feed handler** — decode and normalize
5. **Strategy** — decision and order

```text
Exchange -> L1 / FPGA -> NIC -> Feed handler -> Strategy
```

A switch datasheet number is one slice of this path. Tail latency is an application SLO.

## Capture points

Timestamp at ingress before processing, after normalization, and at a representative subscriber. Monitor sequence loss separately from packet counters.

## Related

- [Deterministic path and host tuning](02_Deterministic_Path_and_Host_Tuning.md)
- [Trading paths](../02_Reference_Architecture/03_Trading_Paths.md)
- [Loss versus latency in trading](../../01_Multicast/12_Quant_Trading_Market_Data/04_Loss_vs_Latency.md)

---
