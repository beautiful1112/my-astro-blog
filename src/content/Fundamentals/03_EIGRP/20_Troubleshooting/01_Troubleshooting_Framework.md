# Troubleshooting framework

Write one testable statement:

“On router R (VRF V), prefix P from neighbor N is/is not: neighbored, present in topology, successor/FS, installed in RIB, or forwarding correctly.”

Then walk **without skipping**:

**neighbor → topology → RIB → forwarding**

Evidence first; change only what the failing stage implicates.

## Stage cheat sheet

| Stage | Prove with | Common causes |
|---|---|---|
| Neighbor | `show ip eigrp neighbors` | AS, K-values, auth, passive, ACL, timers, IP connectivity |
| Topology | `show ip eigrp topology P` | Filters, split horizon, stub, summarization, redistribute |
| RIB | `show ip route P` | AD competition, distribute-list, same prefix better source |
| Forwarding | ping/traceroute/CEF | Asymmetry, Null0, wrong NH, ACL data-plane |

```text
Neighbor --> Topology
T --> RIB
R --> Forwarding
```

## Evidence rules

1. Capture timestamps and outputs from **both** ends before changes.
2. Name the layer that fails; do not soft-clear everything.
3. Prefer event log over packet debug ([Debug Strategy](../19_Operations_and_Observability/03_Debug_Strategy.md)).
4. One change per verification cycle.

## Worksheet

```text
Router: ____  VRF: ____  Prefix: ____  Neighbor: ____
Fails at: neighbor | topology | RIB | forwarding
Evidence command + time: ____
Predicted fix scoped to that stage: ____
```

## Advanced forks

| If you see… | Branch to |
|---|---|
| Never adjacent | [Neighbors Not Forming](02_Neighbors_Not_Forming.md) |
| Active/SIA | [Active and SIA](06_Active_and_SIA.md) |
| In topology, not RIB | [Route in Topology Not in RIB](05_Route_in_Topology_Not_in_RIB.md) |
| Variance ineffective | [Variance Not Load Sharing](08_Variance_Not_Load_Sharing.md) |
| Redistribute silent | [Redistribution Failures](09_Redistribution_Failures.md) |

## Interview framing

“EIGRP triage is neighbor, topology, RIB, then forwarding—prove the stage with show output before changing config.”

## Anti-patterns

- Clearing neighbors before reading topology Active.
- Changing K-values “to test.”
- Applying `variance 128` to force a non-feasible path.
- Disabling auth during an unrelated metric ticket.

## Related

- [Essential Show Commands](../19_Operations_and_Observability/01_Essential_Show_Commands.md)
- [Practical Cases](../21_Practical_Cases/)

---
