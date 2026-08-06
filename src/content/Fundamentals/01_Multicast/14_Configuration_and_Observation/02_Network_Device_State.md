# Router and switch state to inspect

Cisco-like commands:

```text
show ip igmp interface
show ip igmp groups detail
show ip igmp snooping groups
show ip igmp snooping mrouter
show ip pim neighbor
show ip pim rp mapping
show ip pim bsr-router
show ip rpf <source-or-rp>
show ip mroute <group> <source>
show ip mroute count
show ip msdp peer
show ip msdp sa-cache
show interface counters errors
```

Junos-like equivalents include `show igmp group detail`, `show pim neighbors`, `show pim join extensive`, `show multicast route extensive`, and `show multicast rpf`.

Verify group/interface/version, listener and mrouter ports, stable PIM neighbors, DR and Assert winners, correct RP mapping, BSR/RP-set state, RPF toward both source and RP, Register/MSDP state, non-null effective OIL, rising counters, hardware replication, and resource capacity.

Take at least two snapshots. A timer that refreshes, counter that increments, or next hop that changes is more informative than a single static line of output.

