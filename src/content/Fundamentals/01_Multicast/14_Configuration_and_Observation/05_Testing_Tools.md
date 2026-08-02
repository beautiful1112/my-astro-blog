# Safe multicast testing tools

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- sequenced purpose-built sender/receiver;
- `iperf` UDP where the installed version supports multicast;
- `socat` or small socket programs for joins;
- captures at source, first hop, last hop, and receiver;
- `mtrace2` where supported;
- group-state and hardware-replication telemetry.

An unsequenced generator cannot prove absence of loss. Use unique sequence identifiers and synchronized observation points.

