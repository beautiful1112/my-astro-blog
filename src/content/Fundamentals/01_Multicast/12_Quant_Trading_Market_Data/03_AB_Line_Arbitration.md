# A/B line arbitration

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

```text
Expected=100
A:100 -> process; Expected=101
B:100 -> duplicate; discard
B:101 -> process; Expected=102
A:103 -> buffer; gap at 102
B:102 -> process; then process buffered 103
```

The handler needs session/channel identity, wrap/reset rules, a bounded reorder window, duplicate detection, gap timers, recovery quotas, snapshot thresholds, and deterministic handling when replay overlaps live traffic.

Two feeds are useful only when failure domains are independent. Different groups on one switch, fiber, NIC queue, or CPU are not true end-to-end diversity.

