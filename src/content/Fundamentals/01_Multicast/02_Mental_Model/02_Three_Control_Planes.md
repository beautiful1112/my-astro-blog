# The three multicast control planes

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

| Plane | Scope | Main state | Question answered |
|---|---|---|---|
| Host membership | host to local router | IGMP for IPv4; MLD for IPv6 | Does this local link have listeners for `G` or `(S,G)`? |
| Layer-2 replication | VLAN/bridge domain | snooping and multicast MAC table | Which switch ports should receive the frame? |
| Layer-3 tree | router to router | PIM, RPF, MRIB, RP/MSDP | Across which routed interfaces should the packet travel? |

The key separation is:

- IGMP/MLD does not route multicast.
- PIM does not tell an access switch which host port joined.
- Snooping does not construct a routed multicast tree.

Many incidents persist because engineers inspect the wrong plane.

