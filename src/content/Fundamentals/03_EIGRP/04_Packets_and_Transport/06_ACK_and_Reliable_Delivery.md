# ACK and reliable delivery

EIGRP’s **RTP** marks certain packets as **reliable**. The receiver must return an **ACK**. Until acknowledgment (or retry exhaustion / neighbor down), the sender retransmits. **ACK** packets themselves are simple acknowledgments of sequence numbers—they do not carry routing TLVs.

## Reliable versus unreliable

| Unreliable (no ACK) | Reliable (ACK expected) |
|---|---|
| Hello (normal) | Update (when reliable) |
| | Query |
| | Reply |
| | SIA-Query / SIA-Reply |

Multicast reliable packets are often sent to **224.0.0.10**, with **unicast ACKs** (and unicast retransmissions) to neighbors that did not acknowledge. Related: [IP protocol 88 and RTP](01_IP_Protocol_88_and_RTP.md), [Multicast addresses](08_Multicast_Addresses.md).

## Sequence / retry mental model

```text
Send Update seq=N to multicast
  -> Neighbor A ACKs seq=N (unicast)
  -> Neighbor B silent
  -> Retransmit Update seq=N unicast to B
  -> B ACKs or neighbor declared unreliable/down
```

```text
Sender / NeighborB
S -> B: Reliable Update seq N
  [Loss / delay]
S -> B: Retransmit seq N
B -> S: ACK N
```

## Why ops care

- Unidirectional ACLs allowing multicast EIGRP but dropping unicast → stuck retransmits, flapping neighbors.
- High loss links without enough RTP success → topology never syncs.
- Debug showing endless Updates without ACKs → transport path problem, not DUAL math.

## Configuration patterns

### Cisco — static neighbor (unicast RTP plane)

```text
router eigrp 100
 neighbor 10.0.0.2 Serial0/0
```

### CoPP / ACL reminder

Ensure **both** proto 88 multicast and unicast between peers are permitted end-to-end.

## Verification

```text
show ip eigrp neighbors detail
show ip eigrp traffic
debug eigrp packets ack update
```

Look for retransmit counters, SRTT/RTO-style fields in neighbor detail (platform-dependent), and neighbors stuck initializing.

Lab checks:

1. ACL deny unicast proto 88; allow multicast; observe failure mode.
2. Shape/police proto 88 heavily; watch retransmits and Hold.
3. Compare traffic ACK count vs Update count after a change.

## Risks

- Blaming “EIGRP bugs” for ACK path ACLs.
- Assuming Hello success proves reliable Update path (Hello needs no ACK).
- Ignoring NBMA multicast behavior without static neighbors.

## Interview framing

“Reliable EIGRP packets require RTP ACKs—often unicast—even when the original Update/Query was multicast; Hello can succeed while reliable delivery is broken.”

---
