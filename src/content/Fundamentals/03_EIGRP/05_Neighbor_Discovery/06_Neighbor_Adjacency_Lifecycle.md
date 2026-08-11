# Neighbor adjacency lifecycle

An EIGRP adjacency moves from discovery through database exchange into steady Hellos, and can die for transport, parameter, or administrative reasons. Knowing the lifecycle keeps troubleshooting ordered: **form → sync → steady → down**.

## Stages

```text
Hello heard / sent --> Params match?
B --No--> No adjacency
B --Yes--> Neighbor up
C --> Update exchange / sync
D --> Steady: Hellos + event Updates
E --Hold expire / reset / link down--> Neighbor down
F --> Topology via peer removed / Active possible
```

| Stage | What succeeds | What is unproven |
|---|---|---|
| Neighbor up | Hello path + match | Full topology sync |
| Sync done | Routes learned via peer | RIB install / Passive forever |
| Steady | Hold resets | Future query bounds |

Related: [Neighbor table](03_Neighbor_Table.md), [Query and Reply](../04_Packets_and_Transport/05_Query_and_Reply.md).

## Common down causes

| Cause | Typical clue |
|---|---|
| Hold timer expire | Lossy link, ACL, CoPP, timer mismatch |
| Interface down / VRF move | Local link event |
| Auth/K/AS change | Immediate loss after config |
| `clear ip eigrp neighbors` | Operator action |
| RTP retry failure | Q Cnt, retransmits |
| SIA / process reset | Active-related logs |
| BFD session down | Fast down with BFD configured |

## Init exchange notes

After up, reliable Updates populate the topology table. Bidirectional filters or MTU issues can yield **neighbor up with incomplete routes**. Always follow the per-prefix checklist after adjacency recovers.

## Configuration patterns (safe bounce)

### Cisco IOS / IOS XE

```text
clear ip eigrp neighbors 10.1.1.2
! prefer soft evidence capture BEFORE clear
```

Named:

```text
clear eigrp address-family ipv4 neighbors 10.1.1.2
```

## Verification

```text
show ip eigrp neighbors
show log | include EIGRP|eigrp|Neighbor
show ip eigrp topology
```

Lab: flap interface; watch neighbor down, prefixes withdraw or go Active, then recovery to Passive.

## Risks

- Clearing all neighbors during SIA event.
- Celebrating “neighbor up” without topology/RIB checks.
- Ignoring unidirectional loss (Hello one way).

## Interview framing

“EIGRP adjacency lifecycle is Hello match, Update sync, then steady Hold refreshes—neighbor down removes that peer’s paths and may drive Active; up alone never ends the checklist.”

---
