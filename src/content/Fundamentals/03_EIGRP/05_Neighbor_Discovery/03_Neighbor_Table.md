# Neighbor table

The **EIGRP neighbor table** lists live adjacencies: who we speak RTP with, on which interface, with what Hold time remaining, and sequence/smooth RTT style reliability stats. It is the first table in the three-table model—empty neighbor table means no topology learning from that peer.

## What you read in CLI

Typical `show ip eigrp neighbors` columns (wording varies by IOS):

| Field | Meaning |
|---|---|
| Address | Neighbor’s IP on the link |
| Interface | Local interface toward neighbor |
| Hold | Seconds until down if silent |
| Uptime | How long adjacency has been up |
| SRTT / RTO | RTP timing estimates |
| Q Cnt | Reliable packets queued (nonzero → trouble) |
| Seq Num | Last sequence from neighbor |

```text
H   Address       Interface      Hold Uptime   SRTT RTO  Q Seq
0   10.1.1.2      Gi0/0          12   1d02h    20   200  0 45
```

Related: [Three EIGRP tables](../06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md), [ACK and reliable delivery](../04_Packets_and_Transport/06_ACK_and_Reliable_Delivery.md).

## Detail view extras

`show ip eigrp neighbors detail` may show:

- static vs dynamic neighbor;
- stub flags received;
- version / capabilities;
- retransmit counts;
- NSF/BFD associations (platform-dependent).

Stub information here is gold when Queries behave unexpectedly.

## Configuration patterns (population)

Neighbors appear when formation requirements succeed—no separate “neighbor enable” beyond network/`af-interface` and optional static neighbor.

```text
router eigrp 100
 network 10.1.1.0 0.0.0.255
```

## Verification

```text
show ip eigrp neighbors
show ip eigrp neighbors detail
show eigrp address-family ipv4 neighbors
```

Lab checks:

1. Note Hold countdown and reset.
2. Create ACL loss; watch Q Cnt and retransmits climb.
3. Configure stub on peer; confirm detail flags.

## Risks

- Ignoring nonzero Q Cnt as “transient.”
- Clearing neighbors to “refresh” without capturing detail first.
- Confusing neighbor uptime with prefix Passive stability.

## Interview framing

“The EIGRP neighbor table is the adjacency/RTP session list—Hold, queue count, and stub flags tell you whether you can even trust topology learning from that peer.”

---
