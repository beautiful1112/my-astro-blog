# Multicast SAFIs and the Relationship to PIM

Multiprotocol BGP can carry multicast-specific routing information, but BGP does not replace multicast membership or tree construction.

Conceptually:

- BGP can influence multicast route selection, source discovery, or VPN membership depending on the SAFI and design.
- IGMP/MLD manage receiver membership on access networks.
- PIM constructs multicast distribution trees.
- The unicast or multicast RIB supplies reverse-path information.

“MP-BGP supports multicast” therefore does not mean ordinary IPv4 unicast BGP advertisements automatically build multicast forwarding state.

Keep the control roles separate when debugging: membership, source/tree signaling, RPF route, and multicast forwarding entry.

---

