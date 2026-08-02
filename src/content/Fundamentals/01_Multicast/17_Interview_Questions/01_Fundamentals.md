# Interview questions: fundamentals

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

**Does a sender need to join?** No. Joining controls reception; sending selects a multicast destination and egress interface.

**Why no ARP for the group?** The multicast Ethernet destination is calculated from the group.

**Why do 32 IPv4 groups share a MAC?** IPv4 has 28 variable multicast bits; the MAC mapping carries only 23, losing five: `2^5 = 32`.

**What does RPF prevent?** Loops and duplicate forwarding by requiring traffic to arrive from the reverse path toward the source or RP.

**`(*,G)` versus `(S,G)`?** `(*,G)` is shared-tree all-source state; `(S,G)` is source-specific state.

