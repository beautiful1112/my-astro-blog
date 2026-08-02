# End-to-end packet path

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

For UDP from `192.0.2.10` to `232.10.10.10:15000`:

1. The application selects an egress interface and multicast TTL.
2. The host builds an IPv4/UDP packet with a unicast source and multicast destination.
3. The host maps the group algorithmically to an Ethernet multicast MAC; ARP is not used.
4. A switch replicates according to snooping state or unknown-multicast policy.
5. A router accepts the packet only on the correct RPF interface toward the source.
6. It looks up `(S,G)` or applicable `(*,G)` state and copies the packet to the OIL, excluding the IIF.
7. The last-hop switch sends it to listener ports.
8. The receiver NIC admits the frame, the IP layer validates the group/interface, UDP matches the port, and the application reads the datagram.

Every step is a distinct possible drop point.

