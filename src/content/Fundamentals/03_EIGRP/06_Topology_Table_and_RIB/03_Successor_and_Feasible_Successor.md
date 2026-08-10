# Successor and feasible successor

**Successor** is the neighbor providing the best loop-free path to a prefix (lowest computed metric among feasible candidates). **Feasible successor (FS)** is a loop-free backup neighbor that satisfies the **feasibility condition** and can be installed immediately if the successor fails—without going Active.

## Feasibility condition

```text
RD(neighbor) < FD(local)
```

Reported Distance from that neighbor must be **strictly less** than this router’s Feasible Distance. Intuition: the neighbor is closer to the destination than we have ever claimed as our FD, so it cannot be depending on us in a loop for that distance.

Related: [Core terminology](../02_Fundamentals/05_Core_Terminology.md), [Passive versus Active routes](04_Passive_vs_Active_Routes.md).

## Worked relationship

```text
FD = 3072  (best local metric when Passive)
Neighbor A: local metric 3072, RD 2816  -> successor (best)
Neighbor B: local metric 3328, RD 2816  -> FS if 2816 < 3072
Neighbor C: local metric 3500, RD 3200  -> NOT FS if 3200 !< 3072
```

On successor loss:

| FS present? | Action |
|---|---|
| Yes | Promote FS; stay Passive; send Updates as needed |
| No | Active; Query |

## Variance note

**Variance** can install multiple successors/feasible paths into the RIB for UCMP, but a path still must be feasible (meet FC) to be used—variance does not waive loop-freedom. See metrics module for variance math.

## Configuration patterns (observing FS)

### Cisco IOS / IOS XE

```text
show ip eigrp topology
show ip eigrp topology all-links
!
! Optional UCMP
router eigrp 100
 variance 2
```

## Verification lab

1. Identify successor and FS from `(metric/RD)` vs FD.
2. Shut successor with FS present; confirm no Query (`debug eigrp packets query` quiet).
3. Make backup infeasible (raise its RD story); shut successor; confirm Active/Query.

## Risks

- Calling every second-best next hop an FS.
- Using variance on infeasible paths (they will not install).
- Clearing FD understanding after Active recomputation (FD updates when Passive resumes).

## Interview framing

“Successor is the best feasible path; a feasible successor needs RD strictly less than FD so EIGRP can fail over without querying—otherwise the route goes Active.”

---
