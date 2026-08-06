# Minimal PIM-SSM configuration pattern

Illustrative Cisco IOS-like syntax:

```text
ip multicast-routing
ip pim ssm range 232.0.0.0/8

interface Vlan100
 description Source VLAN
 ip pim sparse-mode
 ip igmp version 3

interface Vlan200
 description Receiver VLAN
 ip pim sparse-mode
 ip igmp version 3

interface Port-channel10
 ip pim sparse-mode
```

This still requires MRIB reachability to `S`, snooping/querier design, boundaries, and actual source-specific receiver joins.

