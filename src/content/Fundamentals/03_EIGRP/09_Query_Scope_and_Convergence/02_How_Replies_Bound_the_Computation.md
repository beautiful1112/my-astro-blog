# How replies bound the computation

A diffusing computation for prefix P on router R is **bounded** by the Replies R must collect. Each outstanding Query is a dependency; the computation ends only when every dependency resolves.

## Dependency tree

```text
R Active
├── Query → N1  (N1 Passive → Reply)           ✓ leaf
├── Query → N2  (N2 Active)
│     ├── Query → N4 → Reply to N2
│     └── Query → N5 → Reply to N2
│     └── N2 Reply → R                         ✓ subtree done
└── Query → N3  (stub → Reply, no further)     ✓ leaf
```

R cannot return Passive until N1, N2, and N3 have replied. N2’s delay includes N4/N5. The **slowest branch** sets convergence time for R.

## Bounding mechanisms

| Mechanism | How it bounds |
|---|---|
| Immediate Reply from Passive neighbor | Branch depth 0 |
| Unreachable Reply | Still a Reply—closes the wait |
| Stub | Neighbor replies without expanding depth |
| Summary / no knowledge of specific | Neighbor replies unreachable for specific without deep search |
| Neighbor down | Clears outstanding Query to that peer |
| SIA-Query / reset | Forcibly clears a stuck branch (disruptive) |

## Why “someone knows a path” is not enough

Even if a remote router has an alternate, R still waits for **all** queried neighbors—including those that will eventually say unreachable. Excess Queries to useless branches increase wait time and SIA risk.

Design goal: query only neighbors that can meaningfully contribute, and ensure useless branches terminate fast (stub/summary).

## Timing implication

```text
T_active ≈ max(branch_i reply time)
branch_i ≈ local process + Σ nested Active RTTs
```

One slow non-stub spoke on a high-latency satellite link can set the Active duration for a hub prefix even when other neighbors replied instantly.

## Verification mindset

1. List Active routers for P.
2. For each, list neighbors with outstanding replies (`show` Active detail / debug in lab).
3. Find the deepest Active chain—that is your bound.
4. Ask whether stub/summary should have prevented that depth.

## Interview framing

“Replies close Query edges; the Active wait is a barrier sync over the query tree. Stubs and summaries shorten the tree; SIA means a leaf never closed.”

## Related

- [Reply processing and new successor](../08_DUAL_and_Feasibility/07_Reply_Processing_and_New_Successor.md)
- [Stuck in Active](../08_DUAL_and_Feasibility/08_Stuck_in_Active.md)
- [Convergence timeline](05_Convergence_Timeline.md)

---
