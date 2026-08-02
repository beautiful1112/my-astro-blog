# Low-latency multicast design pattern

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

For a controlled one-source feed with many in-facility receivers:

- SSM and IGMPv3;
- redundant source/feed paths in distinct failure domains;
- PIM-SSM only across required routed boundaries;
- small receiver VLANs with redundant snooping queriers;
- immediate source-rooted trees;
- source/group/port allowlists;
- hardware timestamps and per-hop counters;
- no fragmentation;
- peak pps/microburst capacity tests;
- application sequencing, arbitration, and recovery.

Use ASM when imposed by the venue or legacy system, then engineer RP and source controls explicitly.

