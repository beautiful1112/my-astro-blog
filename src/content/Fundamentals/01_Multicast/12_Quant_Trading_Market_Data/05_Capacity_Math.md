# Multicast capacity math

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Do not size only by average Mbps.

```text
pps ≈ bit rate / (on-wire frame size × 8)
```

Include preamble/SFD, inter-packet gap, FCS, VLAN tags, and encapsulation as appropriate. Small packets can exhaust pps/CPU before bandwidth.

Replication makes egress critical: a 2 Gb/s input copied to 20 ports consumes roughly 40 Gb/s aggregate egress.

```text
queue growth bytes ≈ (aggregate ingress - egress rate) × burst duration / 8
```

This is a lower bound when buffers are shared or internal replication adds contention.

