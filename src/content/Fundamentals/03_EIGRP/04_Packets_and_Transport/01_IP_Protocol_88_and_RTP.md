# IP protocol 88 and RTP

EIGRP does **not** ride TCP or UDP. Packets are carried directly in IP as **protocol number 88**. Reliability, sequencing, and multicast/unicast delivery rules are handled by EIGRP’s own **Reliable Transport Protocol (RTP)**—a lightweight transport tailored to neighbor-scoped routing messages.

## What RTP provides

| RTP provides | RTP does not provide |
|---|---|
| Ordered, reliable delivery when required | Correct DUAL metric math |
| Sequence numbers and acknowledgments | Detection of pure data-plane blackholes |
| Multicast efficiency on LANs | Guaranteed adjacency if AS/K mismatch |
| Unicast retransmission to slow/deaf peers | Cross-AS Internet transport |

Helllos are typically **unreliable** (no ACK expected). Updates, Queries, Replies, and SIA messages that must not be lost use **reliable** RTP (ACK / retransmit). Related: [ACK and reliable delivery](06_ACK_and_Reliable_Delivery.md), [Multicast addresses](08_Multicast_Addresses.md).

## Multicast versus unicast

```text
Multi-access LAN:
  Hello / many Updates  ->  224.0.0.10 (multicast)
  Reliable retransmit   ->  unicast to specific neighbor

NBMA / static neighbor:
  Often unicast Hellos/Updates only (multicast disabled to that peer)
```

```text
RouterA / 224.0.0.10 / RouterB
A -> M: Update (seq N)
M -> B: Update delivered
B -> A: ACK (unicast)
```

## Path and middlebox hazards

- ACLs/CoPP allowing ICMP/`ping` but dropping **IP proto 88**;
- Filters allowing 224.0.0.10 but blocking unicast retransmits/ACKs;
- Mis-sized MTU causing large Update fragmentation issues;
- Wireless/NBMA multipoint without static neighbors → multicast black holes.

## Configuration patterns

### Cisco IOS / IOS XE — ACL awareness

```text
! Conceptual infrastructure ACL fragment
permit eigrp any any
! or: permit 88 any any
permit igmp any host 224.0.0.10
```

### Static neighbor forces unicast

```text
router eigrp 100
 neighbor 10.0.0.2 GigabitEthernet0/0
```

See [Static neighbors](../05_Neighbor_Discovery/04_Static_Neighbors.md).

## Verification

```text
show ip eigrp traffic
show ip eigrp neighbors detail
! packet capture: ip proto 88
debug eigrp packets
```

Lab checks:

1. ACL deny proto 88; neighbor dies despite ping OK.
2. Allow multicast Hello but deny unicast ACK path; observe reliable packet stalls.
3. Compare traffic counters for Hellos vs Updates vs ACKs.

## Risks

- Equating “IP connectivity” with EIGRP transport health.
- CoPP that policed proto 88 during convergence → spurious neighbor flaps.
- Forgetting unicast RTP while debugging “multicast only” ACLs.

## Interview framing

“EIGRP uses IP protocol 88 with its own RTP for sequenced reliable delivery when needed—multicast for efficiency, unicast for ACKs and NBMA—TCP/UDP are not in the path.”

---
