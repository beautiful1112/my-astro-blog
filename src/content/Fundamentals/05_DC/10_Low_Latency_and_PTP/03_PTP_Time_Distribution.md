# PTP time distribution

Dual grandmasters, one active reference.

PTP's Best Master Clock Algorithm selects the best announced clock. The alternate remains available; boundary or transparent clocks distribute time and reduce switch-induced error.

```text
GNSS A -> GM 1 --------+
                       +-> BMCA -> Boundary clock -> NIC PHC
          GM 2 standby +
```

## Design notes

- Two grandmasters; one active reference via BMCA, not two “active” clocks fighting.
- Boundary or transparent clocks in the fabric so switch residence time does not dominate error.
- NIC PHC is the host’s timestamp source for capture and order-audit, not an afterthought.

## Related

- [Latency distribution](01_Latency_Distribution.md)
- [Deterministic path and host tuning](02_Deterministic_Path_and_Host_Tuning.md)

---
