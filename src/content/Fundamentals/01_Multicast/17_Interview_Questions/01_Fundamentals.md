# Interview questions: fundamentals

## Question

Does a multicast sender need to join the group? Why is there no ARP for the group address? Why can many IPv4 groups share one MAC? What does RPF prevent? What is the difference between `(*,G)` and `(S,G)`?

## Strong answer

- **Join:** No. Joining controls *reception*. Sending selects a multicast destination, egress interface (`IP_MULTICAST_IF`), and TTL. Receivers join so IGMP/MLD and trees deliver traffic to them.
- **No ARP:** The Ethernet destination is derived from the IPv4 group (`01:00:5e` + 23 bits), not resolved via ARP.
- **MAC aliasing:** IPv4 has 28 variable multicast bits; the MAC mapping carries 23, so `2^(28-23) = 32` groups share a MAC. Hosts and apps must filter on IP (and port).
- **RPF:** Requires traffic to arrive on the interface used to reach the tree root (source or RP), limiting loops and duplicate forwarding.
- **`(*,G)` vs `(S,G)`:** Shared-tree all-source state versus source-specific state on a source tree.

## Follow-ups

- Who emits IGMP—sender or receiver?
- What happens if TTL is 1 across a router?
- How does SSM change whether `(*,G)` exists?

## Cross-links

[UDP and multicast](../11_Host_and_Application/01_UDP_and_Multicast.md), [RPF check](../07_RPF_and_Forwarding/02_RPF_Check.md), [Ethernet mapping lab](../18_Labs/01_Ethernet_Mapping.md).

---
