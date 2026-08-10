# Unexpected metrics

Path preference “looks wrong”: traffic prefers slow backup, or equal-cost appears unequal.

## Metric inputs (classic K1/K3)

Composite ≈ f(minimum bandwidth, cumulative delay). Reliability/load unused by default (K2/K4/K5=0).

| Misconfig | Symptom |
|---|---|
| Tunnel `bandwidth` default | Enormous metric / odd preference |
| Delay left default on subifs | Ties or wrong winner |
| Offset-list forgotten | Artificial penalty |
| Wide vs classic mix | Incomparable magnitudes |
| Redistribute seed too low/high | External dominates or ignored |

## Evidence

```text
show interface Tunnel0 | include BW|Dly
show ip eigrp topology P
show ip eigrp topology all-links
show ip protocols | include Weight|K
```

Compute whether reported metrics match configured BW/delay hop-by-hop.

## Method

1. Trace successor path hop by hop.
2. At each hop record BW/delay.
3. Find the first hop that disagrees with design sheet.
4. Correct interface metrics; avoid random variance as compensation.

## Case link

[Bandwidth Mis-set Metric Explosion](../21_Practical_Cases/08_Bandwidth_Mis-set_Metric_Explosion.md) and [Unequal Delay Tuning Mistake](../21_Practical_Cases/12_Unequal_Delay_Tuning_Mistake.md).

## Interview framing

“Wrong EIGRP preference is usually wrong bandwidth/delay on a tunnel or subinterface—verify K-weights and interface metrics before policy hacks.”

## Redistribution seed confusion

Externals carry seed metrics that may dominate or lose to internals unexpectedly. Compare `show ip eigrp topology` flags (internal vs external) before tuning delay on transit links.

## Worked mini-example

Hop A→B: BW 100000, delay 10; B→C: BW 10000, delay 100. Min BW is 10000; delays accumulate. If a tunnel hop still shows BW 9, it dominates min-BW and swamps every careful delay tweak downstream—fix that hop first.

## Offset-list reminder

An old `offset-list` can add delay-equivalent penalty and look like “mystery metric.” Include `show run | include offset-list` in every unexpected-metric ticket.

## Related

- [Bandwidth Percent and Pacing](../17_WAN_NBMA_and_Tunnels/04_Bandwidth_Percent_and_Pacing.md)
- [Wide Metrics Migration](../18_Scale_and_Design/04_Wide_Metrics_Migration.md)
- [Variance Not Load Sharing](08_Variance_Not_Load_Sharing.md)

---
