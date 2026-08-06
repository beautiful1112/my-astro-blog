# One-sentence recall

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

- **IGMP/MLD:** local-link receiver interest.
- **Snooping:** switch-port replication optimization.
- **PIM:** router-to-router tree construction.
- **RPF:** packet must arrive from the reverse path toward source/RP.
- **ASM:** receiver knows `G`; RP helps discover `S`.
- **SSM:** receiver knows `(S,G)`; direct tree and no RP.
- **RP:** ASM rendezvous/control anchor and initial data waypoint.
- **RP redundancy:** make mapping, reachability, and source synchronization resilient separately.
- **BSR:** distributes the RP-set; it is not automatically the RP.
- **Anycast RP:** one logical RP address on several routers, plus source synchronization between them.
- **MSDP:** shares active IPv4 ASM sources between RPs.
- **MBGP:** supplies RPF topology; does not carry data or build trees.
- **A/B feeds:** application redundancy that requires independent failure domains.

