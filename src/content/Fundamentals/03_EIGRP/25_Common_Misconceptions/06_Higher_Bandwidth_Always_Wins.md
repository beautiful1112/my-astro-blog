# Misconception: Higher Bandwidth Always Wins

## The myth

“The path with the highest interface bandwidth is always preferred.”

## Why it is wrong

With default K-values, the composite uses **minimum bandwidth along the path** and **cumulative delay**. Many hops of delay, or manually set `delay`, often dominate path choice. A “faster” serial/Ethernet BW value can lose to a lower-delay path. Also, mis-set `bandwidth` on tunnels warps metrics without reflecting reality.

## Counterexample (numeric intuition)

Default-style composite scales with `(K1 × BW_term) + (K3 × delay_term)` (classic formula; ignore K2/K4/K5 at defaults).

```text
Path A: 1 hop, BW 100 Mb/s, delay 1000 (tens of μs)  → moderate metric
Path B: 1 hop, BW 1000 Mb/s, delay 5000               → delay term dominates → worse
Path C: 3 hops of “Gig”, each delay 100               → cumulative delay can beat Path B
```

Concrete lab: two paths R1→Dest; set `bandwidth 1000000` on the slow path but leave huge `delay`; set modest BW and low delay on the other—successor follows composite, not the BW column alone.

```text
R1 --(high BW, high delay)-- R2 -- Dest
R1 --(lower BW, low delay)-- R3 -- Dest
```

## Ops symptom table

| Symptom | Check |
|---------|--------|
| “We upgraded the link” but traffic unchanged | Delay/other hop still dominates |
| Tunnel preferred incorrectly | Inflated default BW on tunnel |
| Unexpected successor after BW change | Recalculate min-BW + sum delay |
| Want TE without touching BW | Prefer documented `delay` tuning |

## Correct habit

Compare **composite metrics** and delay budgets, not a single `show interface` BW column. For TE, prefer intentional `delay` changes and document them.

## Related

- [Bandwidth and delay components](../07_Metrics_and_K_Values/02_Bandwidth_and_Delay_Components.md)
- [Metric calculation worked example](../07_Metrics_and_K_Values/07_Metric_Calculation_Worked_Example.md)
- [Interface bandwidth delay tuning](../07_Metrics_and_K_Values/06_Interface_Bandwidth_Delay_Tuning.md)
- [Case: bandwidth mis-set metric explosion](../21_Practical_Cases/08_Bandwidth_Mis-set_Metric_Explosion.md)

---
