# Interview questions: multicast BGP, MVPN, and EVPN

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

**What is MBGP?** Multiprotocol BGP carrying a multicast SAFI so source/RP reachability used by the MRIB can differ from unicast reachability.

**What are the IPv4 multicast AFI and SAFI?** AFI 1, SAFI 2. IPv6 multicast reachability is AFI 2, SAFI 2.

**Does multicast SAFI advertise group addresses?** No. It advertises unicast-form source/RP prefixes used for multicast RPF.

**Which attributes carry multiprotocol reachability and withdrawal?** `MP_REACH_NLRI` type 14 and `MP_UNREACH_NLRI` type 15.

**Can one BGP session carry unicast and multicast families?** Yes, if both peers negotiate each AFI/SAFI and activate appropriate policy.

**Why can ping work while multicast fails?** Ping follows the unicast RIB; PIM/data RPF may use a different multicast SAFI/MRIB path.

**What must exist on an MBGP-selected link besides BGP?** A usable multicast data path and normally PIM adjacency for Join/Prune signaling.

**MBGP versus MSDP?** MBGP advertises source/RP prefix reachability; MSDP advertises active IPv4 ASM `(S,G)` source knowledge between RPs.

**What is C-multicast versus P-multicast?** Customer source/group/tree state versus provider tunnel/tree state carrying customer packets between PEs.

**What is a PMSI?** A conceptual provider multicast service interface connecting PEs, instantiated by ingress replication or a provider multipoint tunnel.

**I-PMSI versus S-PMSI?** Inclusive PMSI reaches all participating VPN PEs; selective PMSI reaches only PEs interested in selected high-rate flows.

**List the RFC 6514 MVPN route types.** 1 Intra-AS I-PMSI A-D, 2 Inter-AS I-PMSI A-D, 3 S-PMSI A-D, 4 Leaf A-D, 5 Source Active A-D, 6 Shared Tree Join, 7 Source Tree Join.

**What does the PMSI Tunnel Attribute carry?** Tunnel type, tunnel identifier, optional label, and whether explicit leaf information is required.

**Why can an S-PMSI route exist while data fails?** The receiving PE may not have instantiated the P-tunnel, label, VRF binding, or hardware forwarding state.

**What is EVPN SMET?** Selective Multicast Ethernet Tag route type 6, advertising tenant `(*,G)` or `(S,G)` interest for an EVPN bridge domain.

**What are EVPN multicast route types 7 and 8?** Membership Report Synch and Leave Synch routes used to coordinate IGMP/MLD state on a multihomed Ethernet segment.

**Underlay multicast versus tenant multicast?** Underlay multicast can replicate VXLAN BUM packets; tenant multicast represents host group interest and may require overlay proxy and routed multicast functions.

**Ingress replication trade-off?** It removes underlay multicast state but makes ingress/underlay bandwidth scale with remote VTEP/PE count.

**What does a Type 6 SMET route not prove?** That a VXLAN/PMSI tunnel and hardware replication list were successfully programmed.

**How do you troubleshoot BGP multicast?** Follow capability, NLRI/policy, best path, next-hop resolution, MRIB/RPF, PIM/C-tree state, tunnel/label, MFIB, then packets.
