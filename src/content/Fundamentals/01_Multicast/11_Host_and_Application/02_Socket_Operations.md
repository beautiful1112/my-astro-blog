# Multicast socket operations

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

Receiver sequence:

1. create a datagram socket;
2. set reuse and receive-buffer options as required;
3. bind the UDP port;
4. join `G` on the correct interface, or `(S,G)` for SSM;
5. read quickly and validate application sequences.

Sender options include `IP_MULTICAST_IF`, `IP_MULTICAST_TTL`, `IP_MULTICAST_LOOP`, and IPv6 equivalents. Receiver APIs include `IP_ADD_MEMBERSHIP`, `IP_ADD_SOURCE_MEMBERSHIP`, `MCAST_JOIN_GROUP`, and `MCAST_JOIN_SOURCE_GROUP` where supported.

Binding a port is not a join. Membership belongs to a socket/interface context.

