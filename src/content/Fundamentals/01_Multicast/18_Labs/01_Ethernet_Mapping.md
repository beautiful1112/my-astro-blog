# Lab 1: Ethernet mapping

Prove that IPv4 multicast MAC mapping is many-to-one and that captures must not key only on Layer-2 destination.

## Topology

```text
Sender 192.0.2.10 ---- L2 switch ---- Receiver 192.0.2.20
Tap/SPAN on receiver access port
```

## Objectives

- Compute Ethernet destination MACs for several IPv4 groups.
- Capture frames and show MAC aliasing.
- Explain why filters on IP group remain necessary.

## Config touchpoints

- Host sender/receiver on same VLAN; no PIM required.
- Optional: static IGMP join or simple `IP_ADD_MEMBERSHIP`.

## Tasks

Calculate the destination MAC for:

```text
224.1.2.3
225.1.2.3
239.1.2.3
232.129.2.3
```

Mapping reminder:

```text
01:00:5e + lower 23 bits of the group
```

1. Send UDP to each group in turn (same payload/port).
2. Capture with Ethernet headers (`tcpdump -e`).
3. Join only one group on the receiver; observe which senders are delivered (NIC imperfect filtering may deliver extras—app must discard).

## Failure injection

- Program an incorrect static MAC filter on a test NIC if available.
- Flood two aliased groups simultaneously; confirm application demux by IP destination.

## Expected evidence

```text
All four groups map to the same MAC 01:00:5e:01:02:03
Captures show identical dest MAC with distinct IPv4 destinations
Receiver join for one group does not make the other three "correct" at L3
```

```text
tcpdump -ni eth0 -e -vv 'udp and net 224.0.0.0/4'
```

## Cross-links

[Wrong multicast MAC](../16_Practical_Cases/08_Wrong_Multicast_MAC.md), [Packet capture](../15_Troubleshooting/05_Packet_Capture.md).

---
