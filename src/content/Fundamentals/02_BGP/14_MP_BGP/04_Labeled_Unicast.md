# BGP Labeled Unicast

BGP labeled unicast carries a prefix together with an MPLS label. It is defined for IPv4 and IPv6 and commonly used for inter-area or inter-AS label distribution and transport stitching.

The receiving router must understand:

- The IP prefix.
- The advertised label.
- The BGP next hop.
- The label-switched path or recursive transport to that next hop.

Control-plane reachability without a valid label operation still fails in the data plane. Inspect both the BGP RIB and label forwarding table.

Labeled unicast is not the same as VPN NLRI: VPN routes add an RD and commonly carry VPN membership via route targets.

---

[← Module index](README.md) | [↑ BGP master index](../BGP_Deep_Dive.md)
