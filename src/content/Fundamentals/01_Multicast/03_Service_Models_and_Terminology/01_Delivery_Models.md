# Unicast, broadcast, anycast, and multicast

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

| Model | Destination meaning | Replication | Common use |
|---|---|---|---|
| Unicast | one interface | one copy per destination | SSH, TCP, APIs |
| Broadcast | every node in an IPv4 broadcast domain | flooded within scope | ARP and legacy discovery |
| Anycast | one nearest member of a set | routing selects one | DNS and service front ends |
| Multicast | all subscribed group members | network fan-out along a tree | market data, IPTV, control protocols |

IPv6 has no broadcast address; multicast supplies its necessary one-to-many functions.

