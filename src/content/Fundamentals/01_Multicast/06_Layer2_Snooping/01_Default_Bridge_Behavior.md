# Default Layer-2 multicast behavior

A switch can learn where unicast source MACs live, but a multicast destination does not identify one port. Without multicast-aware state, bridging normally floods multicast to eligible ports in the VLAN.

IGMP/MLD snooping examines membership control packets and builds entries such as:

```text
VLAN 120, group 232.10.10.10
  receiver ports: Ethernet1/1, Ethernet1/7
  multicast-router ports: Ethernet1/48, Port-Channel10
```

Snooping is a Layer-2 replication optimization; it is not multicast routing.

