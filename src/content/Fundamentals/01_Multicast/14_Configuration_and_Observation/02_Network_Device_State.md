# Router and switch state to inspect

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Cisco-like commands:

```text
show ip igmp interface
show ip igmp groups detail
show ip igmp snooping groups
show ip igmp snooping mrouter
show ip pim neighbor
show ip pim rp mapping
show ip rpf <source-or-rp>
show ip mroute <group> <source>
show ip mroute count
show interface counters errors
```

Junos-like equivalents include `show igmp group detail`, `show pim neighbors`, `show pim join extensive`, `show multicast route extensive`, and `show multicast rpf`.

Verify group/interface/version, listener and mrouter ports, stable PIM neighbors, correct RP mapping, correct RPF, non-null OIL, rising counters, hardware replication, and resource capacity.

