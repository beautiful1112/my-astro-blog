# Common multicast misconceptions

Each row is a myth you will hear in labs and interviews. The correction is the habit to keep.

| Misconception | Why it is wrong | Correct habit |
|---|---|---|
| Sender must join to send | Join controls *reception*. Sending only needs dest `G`, egress, TTL. | Separate send path from membership |
| IGMP routes multicast | IGMP/MLD is host↔router membership only. | Debug PIM/RPF for routed trees |
| Snooping “blocks” multicast | Snooping *constrains* flood; bad state black-holes. | Verify querier, mrouter, member ports |
| PIM neighbor up = service up | Adjacency ≠ RPF, OIL, MFIB, or data. | Walk Join, RPF, counters, capture |
| RP failure always stops data | Established SPT can bypass the RP. | Separate new ASM vs existing SPT |
| SSM is only `232/8` | SSM is the `(S,G)` service model; range is policy. | Confirm IGMPv3 INCLUDE + SSM range |
| Two groups = redundancy | Shared leaf/NIC/queue is one failure domain. | Independent A/B paths + arbitration |
| No switch drops ⇒ no loss | Host stacks drop invisibly to the switch. | TAP vs NIC vs socket vs app sequences |
| More buffering fixes loss | Buffering trades loss for stale latency. | Size for microburst *and* freshness |
| TTL secures scope | TTL is a hop bound, not a boundary. | Use multicast boundaries and ACLs |
| MBGP advertises groups | SAFI 2 carries source/RP *prefixes* for RPF. | Compare unicast vs multicast RIB for `S` |
| BGP up ⇒ multicast routing OK | Need AFI/SAFI, NLRI, MRIB, PIM, MFIB. | Per-family verification |
| MSDP carries user data | MSDP shares active ASM *sources* (SA). | Expect PIM trees for data |
| MVPN route ⇒ packets flow | Need PMSI tunnel + hardware binding. | Inspect tunnel and counters |
| EVPN SMET is the data plane | SMET signals interest; another tunnel carries packets. | Trace SMET then ingress-replication/core |
| Underlay VXLAN MC = tenant MC | Underlay BUM ≠ tenant L3 multicast design. | Design overlay control separately |
| DR forwards every stream on a LAN | Assert elects per-tree forwarder. | Compare DR vs Assert winner |
| Static mroute is a normal fix | It masks MRIB/ECMP/MBGP problems. | Fix routing; document any override |
| Fast leave always helps | Shared ports black-hole remaining listeners. | Single-listener ports only |
| `show mroute` proves forwarding | MFIB/hardware may not match control. | Compare mroute, MFIB, wire |

Related: [Three control planes](../02_Mental_Model/02_Three_Control_Planes.md), [Symptom matrix](../15_Troubleshooting/04_Symptom_Matrix.md), [Interview fundamentals](../17_Interview_Questions/01_Fundamentals.md).

## Quick counterexamples

1. Ping to `S` works; multicast fails → RPF/MBGP, not “IP broken.”
2. IGMP group present; host silent → snooping/mrouter or NIC filter.
3. RP unreachable; `(S,G)` still forwarding → SPT already built.
4. A and B different groups; both gap together → shared egress/queue.

## Interview framing

“Name the myth, name the plane it confuses—membership, L2, or L3—and say what evidence would disprove it.”

---
