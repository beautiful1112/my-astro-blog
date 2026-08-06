# Multicast VPNs over MPLS

Multicast VPN designs distinguish:

- **C-multicast:** customer multicast routes/PIM behavior;
- **P-multicast:** provider transport trees or tunnels;
- **PMSI:** provider multicast service interface;
- **I-PMSI:** inclusive tree for many flows;
- **S-PMSI:** selective tree for chosen high-volume flows.

Transport may use P2MP RSVP-TE, mLDP, ingress replication, or another tunnel. BGP MVPN families signal customer multicast routes and tunnel attributes. Design trades control state against bandwidth efficiency and convergence.

