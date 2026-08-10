# Case 8: Wrong multicast MAC calculation

[← Module index](README.md) · [↑ Multicast master index](../Multicast_Deep_Dive.md)

---

## Topology and symptom

Operator builds a static filter or custom encoder for group `239.1.2.3` (or `232.10.10.10`) and tries to place all 28 host-significant group bits into the Ethernet destination. Hosts or switches filter on the “correct” IP-derived MAC and never match the frames. Same-VLAN receivers that rely on the broken filter see nothing; a promiscuous capture still shows IP multicast.

```text
IPv4 group:  239.1.2.3
Bits used:   low 23 bits only
MAC:         01:00:5e:01:02:03
Wrong idea:  encode 239 / full 28 bits into MAC
```

## Failure mechanism

Ethernet IPv4 multicast mapping uses prefix `01:00:5e`, forces the high bit of the fourth MAC octet to `0`, and copies only the low 23 bits of the IPv4 group. Higher group bits are not represented, so many groups alias to one MAC. Encoding “all group bits” produces a non-standard MAC that does not match host IGMP-derived filters or switch snooping entries built from the real mapping.

## Evidence

- frame destination MAC does not equal `01:00:5e` + low-23 mapping;
- host join for `239.1.2.3` programs `01:00:5e:01:02:03` (example) and misses the crafted frames;
- switch snooping OIL is correct for IP group but L2 filter mismatches;
- promiscuous or ACL-based capture sees UDP to the group IP;
- another group that aliases to the same correct MAC may be accepted unexpectedly;
- unicast and correctly mapped multicast on other groups work.

## Investigation

1. compute the standard MAC for the group by hand and with an OS/API dump;
2. compare that value to the destination MAC on the wire;
3. inspect host multicast filter lists (e.g. NIC perfect/hash filters);
4. check whether a static MAC ACL or encoder used the full 28-bit idea;
5. verify snooping is keyed on IP/IGMP while some ports filter only on MAC;
6. test a second group that shares the same low 23 bits (aliasing).

## Fix and validation

Use prefix `01:00:5e`, clear the high bit of the fourth octet, and map only the low 23 IPv4 group bits. Fix custom tools and static filters accordingly; do not invent a 28-bit MAC encoding.

Rejoin the group and confirm wire MAC, host filter, and application RX all agree.

## Lesson

Multicast MAC mapping is a lossy 23-bit hash under `01:00:5e`, not a full encoding of the group. Wrong MAC math looks like a network outage while the IP packets are still on the wire.
