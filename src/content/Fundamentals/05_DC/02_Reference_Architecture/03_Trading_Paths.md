# Trading paths

Physically independent A/B exchange paths. Use Layer-1 switching or deterministic low-latency switching where the latency budget demands it.

Keep A and B independent from exchange handoff to application NIC.

```text
Exchange A -> L1 / FPGA A -> Feed handler A -+-> Trading VRF subscribers
                                             +-> Production VRF consumers
Exchange B -> L1 / FPGA B -> Feed handler B -+
```

## Design rules

- A and B are **failure domains**, not just two multicast groups on one leaf pair.
- Fan-out and capture sit on the exchange-facing path before the general fabric.
- Normalized feeds may enter the EVPN fabric; raw exchange channels should not share fate with production east-west traffic.
- Network redundancy is useful only when the subscriber can distinguish and reconcile A/B data. See [feed as a data product](../08_Market_Data/01_Feed_as_Data_Product.md).

## When the general fabric is enough

Not every market-data consumer needs Layer-1. Production consumers, research, and delayed feeds can ride the EVPN fabric once a feed handler has normalized the product.

Use the isolated path when the latency distribution — P50, P99, P99.9 — is a first-class requirement, not a device datasheet number. See [latency distribution](../10_Low_Latency_and_PTP/01_Latency_Distribution.md).

## Related

- [One fabric, two paths](01_One_Fabric_Two_Paths.md)
- [A/B independence](../08_Market_Data/02_AB_Independence.md)
- [Deterministic path and host tuning](../10_Low_Latency_and_PTP/02_Deterministic_Path_and_Host_Tuning.md)

---
