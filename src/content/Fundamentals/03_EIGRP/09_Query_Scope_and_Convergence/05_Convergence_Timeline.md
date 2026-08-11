# Convergence timeline

EIGRP convergence time is dominated by **failure detection** plus either **local FS repair** or an **Active query round-trip** across the query domain.

## Path A — local FS repair

```text
t0  Link/neighbor failure detected (PHY, hold timer, or BFD)
t1  DUAL selects feasible successor (local computation)
t2  RIB/FIB update; Updates sent to neighbors as needed
```

Control-plane switch is fast once detection fires. No Query wait. Typical target design for access dual-homing: always keep an FS.

## Path B — Active diffusion

```text
t0  Detection
t1  No FS → Active; Queries sent
t2  Neighbors Reply or go Active (recursive)
t3  All Replies collected at originator
t4  New successor installed; Passive; Updates flood
```

Time ≈ detection + Σ(query/reply latency along slowest branch) + processing. In a large unbounded domain this reaches seconds to SIA-scale minutes.

```text
Detection / DUAL / Neighbors
Det -> DUAL: Successor lost
alt FS exists
DUAL -> DUAL: Local repair Passive
else No FS
DUAL -> N: Query
N- -> DUAL: Reply (maybe nested Active)
DUAL -> DUAL: New successor Passive
end
```

## Detection vs DUAL

| Mechanism | Order of magnitude (typical) |
|---|---|
| Carrier / interface down | ms–tens of ms |
| BFD | tens of ms (tuned) |
| EIGRP hold timer (default hellos) | seconds (e.g. 15s WAN defaults vary) |
| Local FS install | fast after detection |
| Bounded Active | ~RTT × depth |
| SIA | active-time order (historically ~180s) |

Tuning hello/hold without BFD is a blunt instrument; prefer BFD for fast detection and stub/summary for fast Active bounds.

## Verification exercise

1. Measure time from `debug`/log link down to new `show ip route` next hop with FS present.
2. Remove FS (metric tweak) and repeat—compare Active duration.
3. Add stub/summary and repeat Active test—duration should collapse.

## Interview framing

“Two clocks: detection and DUAL. FS → local repair. No FS → query RTT of the domain. Design so critical prefixes never need a wide Active.”

## Related

- [Feasible successor and local repair](../08_DUAL_and_Feasibility/05_Feasible_Successor_and_Local_Repair.md)
- [How replies bound the computation](02_How_Replies_Bound_the_Computation.md)
- [Designing the query domain](06_Designing_the_Query_Domain.md)

---
