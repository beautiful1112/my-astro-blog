# Interview: Neighbors and Transport

## Q1 — Protocol and multicast

**Q:** What IP protocol and multicast addresses does EIGRP use?

**Model answer:** EIGRP uses **IP protocol 88**. IPv4 hellos/updates go to **224.0.0.10**; IPv6 uses **FF02::A**. Reliable delivery is handled by RTP (sequence + ACK), not TCP.

**Common wrong answer:** “TCP 88” or “UDP 88.” EIGRP is neither; protocol 88 is its own IP protocol number.

## Q2 — Neighbor formation requirements

**Q:** List the hard requirements for two Cisco routers to become EIGRP neighbors.

**Model answer:** Matching **AS number**, matching **K-values**, common primary subnet (same major network/mask on the link for classic IPv4), compatible address family, and matching authentication if configured. Hello/Hold need not be identical (Hold is taken from the neighbor’s Hello).

**Common wrong answer:** “Hello timers must match like OSPF Hello/Dead.” Hold is advertised; asymmetric Hello intervals are legal if Hold does not expire.

## Q3 — Hello and Hold defaults

**Q:** Default Hello/Hold on LAN vs low-speed WAN, and who owns Hold?

**Model answer:** Classic LAN defaults are **5s Hello / 15s Hold**. Many NBMA/WAN profiles use **60/180**. Hold Time is carried in Hellos; a router uses the Hold value **advertised by the neighbor**.

**Common wrong answer:** Claiming Hold is always 3× local Hello regardless of what the peer advertises.

## Q4 — RTP reliability

**Q:** Which EIGRP packets are reliable, and how are missed packets recovered?

**Model answer:** Updates, Queries, Replies, and SIA messages that require reliability use RTP: multicast (or unicast) with sequence numbers; missing ACKs trigger **unicast retransmission**. Hellos are typically unreliable (no ACK).

**Common wrong answer:** “Everything is multicast and fire-and-forget.” Partial updates are bounded and retransmitted when reliability is required.

## Q5 — Static neighbors

**Q:** When do you configure `neighbor` under EIGRP, and what side effect matters?

**Model answer:** On NBMA/multipoint where multicast is broken or undesirable. Configuring a static neighbor typically **disables multicast Hellos on that interface** for that AS—peers must be listed or they will not form.

**Common wrong answer:** Using static neighbors “for security only” on Ethernet without understanding multicast is disabled for other potential peers.

## Q6 — Passive interface

**Q:** What does `passive-interface` do in EIGRP?

**Model answer:** Suppresses Hellos (no adjacency) on that interface while still **advertising the connected network** into EIGRP (unless further filtered). Ideal for access/user VLANs.

**Common wrong answer:** “Passive means the subnet is not advertised.” That is distribute-list / redistribute filtering, not passive.

## Q7 — Init and first exchange

**Q:** After adjacency comes up, what must you still verify before declaring “routing works”?

**Model answer:** Topology has expected prefixes (successor/FS), RIB install (AD competition), and data-plane reachability. Neighbor “up” only proves Hello/K/AS/auth alignment—not correct metrics, filters, or stubs.

**Common wrong answer:** Stopping at `show ip eigrp neighbors` with a non-zero uptime.

## Cross-links

[Formation requirements](../05_Neighbor_Discovery/01_Neighbor_Formation_Requirements.md), [IP 88 / RTP](../04_Packets_and_Transport/01_IP_Protocol_88_and_RTP.md), [Multicast addresses](../04_Packets_and_Transport/08_Multicast_Addresses.md).

---
