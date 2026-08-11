# DUAL overview

**DUAL** (Diffusing Update Algorithm) is the decision process EIGRP uses to install loop-free paths and to reconverge when the best path is lost. It is not a separate protocol; it is the finite-state logic that owns each destination prefix in the topology table.

## Two modes of computation

| Mode | When | What happens |
|---|---|---|
| **Local computation** | A feasible successor (FS) exists for the destination | Router switches to the FS immediately; no query flood |
| **Diffusing computation** | No FS qualifies after successor loss/metric change | Prefix goes **Active**; router queries neighbors and waits for replies |

Local repair is the fast path operators want. Diffusing computation is correct but slower and can span a large query domain.

```text
Successor lost or metric worsens --> Feasible successor / in topology table?
FS --yes--> Local computation / install FS as successor
FS --no--> Go Active / send Query
Active --> Collect Replies
Wait --> Select new successor / return Passive
```

## Loop freedom property

DUAL guarantees that a path chosen under the **feasibility condition (FC)** cannot form a routing loop toward that destination, even while other routers are still converging. The intuition: if neighbor N’s reported distance to D is strictly better than this router’s feasible distance, N cannot be relying on this router to reach D—so using N cannot create a loop through self.

That guarantee is **per-prefix** and **at control-plane selection time**. It does not replace:

- correct K-value consistency across the AS;
- careful redistribution and summarization design;
- data-plane ECMP/UCMP quirks once multiple next hops are installed.

## Passive vs Active

- **Passive**: router has a successor and is not waiting on a diffusing computation for that prefix. Normal steady state.
- **Active**: router has no loop-free FS (or metric change forced diffusion) and is waiting for Query replies before installing a new successor.

A router can be Passive for most prefixes and Active for a few. `show ip eigrp topology active` (classic) / `show eigrp address-family … topology active` (named) is the first ops view during a convergence event.

## What DUAL is not

- Not SPF: EIGRP does not flood full topology LSAs and recompute a shortest-path tree for every change.
- Not “always query”: if an FS exists, queries are skipped.
- Not immunity to SIA: unbounded or poorly bounded query domains still cause Stuck-in-Active.

## Interview framing

Lead with: “DUAL keeps prefixes Passive when an FS exists; otherwise it goes Active and queries. Loop freedom comes from the feasibility condition, not from hop-count alone.”

## Related

- [Reported distance and feasible distance](02_Reported_Distance_and_Feasible_Distance.md)
- [Feasibility condition](03_Feasibility_Condition.md)
- [Going Active and queries](06_Going_Active_and_Queries.md)
- [Stuck in Active](08_Stuck_in_Active.md)

---
