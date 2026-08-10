# Interview: Metrics, K-Values, and Wide Metrics

## Q1 — Default K-values

**Q:** Default K1–K5 and what that implies for the composite metric?

**Model answer:** Defaults: **K1=1, K2=0, K3=1, K4=0, K5=0**. With defaults, metric ≈ scaled **minimum bandwidth** and **cumulative delay** along the path. Reliability and load are ignored unless K2/K4/K5 are enabled.

**Common wrong answer:** “EIGRP always uses bandwidth, delay, reliability, load, and MTU.” MTU is carried historically but not in the classic composite; Rel/Load need non-default Ks.

## Q2 — Bandwidth vs delay dominance

**Q:** Why does “higher bandwidth always wins” fail as a rule of thumb?

**Model answer:** With default Ks, **delay often dominates**, especially across many hops or when interface delay is manually tuned. A slightly slower link with much lower delay can win over a high-BW path with large cumulative delay.

**Common wrong answer:** Ranking paths solely by `show interface` Bandwidth.

## Q3 — Min BW and cumulative delay

**Q:** How are bandwidth and delay taken along a path?

**Model answer:** **Bandwidth** component uses the **minimum** configured bandwidth along the path. **Delay** is the **sum** of delays of outbound interfaces along the path (in tens of microseconds in classic scaling).

**Common wrong answer:** Averaging bandwidth or using only the exit interface delay.

## Q4 — K-value mismatch

**Q:** What happens if K-values differ between neighbors?

**Model answer:** Adjacency **does not form** (or drops). Ks must match for neighbor establishment—visible in Hello TLVs / neighbor debugs.

**Common wrong answer:** “Routes install with weird metrics but neighbors stay up.”

## Q5 — Wide metrics

**Q:** Why wide metrics, and what must you watch in migration?

**Model answer:** Classic 32-bit scaled metrics compress high-speed links; **wide metrics** use 64-bit throughput/latency style components for better differentiation on ≥1G/10G paths. Mixed classic/wide domains need careful migration; RIB may still show scaled values depending on platform feed.

**Common wrong answer:** “Wide metrics change AD” or “automatically enable UCMP.”

## Q6 — Bandwidth-percent vs bandwidth

**Q:** Difference between interface `bandwidth` and `ip bandwidth-percent eigrp`?

**Model answer:** `bandwidth` feeds the **metric** (and other features). `ip bandwidth-percent eigrp` (or named af-interface equivalent) limits **EIGRP pacing**—how much interface bandwidth EIGRP control traffic may consume—not the composite metric itself.

**Common wrong answer:** Using bandwidth-percent to traffic-engineer path selection.

## Q7 — Worked intuition

**Q:** Two equal-BW paths; path A delay 100 µs total, path B 1000 µs. Which wins with defaults?

**Model answer:** Path A—lower cumulative delay with same min BW yields lower composite metric.

**Common wrong answer:** Calling them ECMP without checking delay.

## Cross-links

[Composite formula](../07_Metrics_and_K_Values/01_Composite_Metric_Formula.md), [Wide metrics](../07_Metrics_and_K_Values/05_Wide_Metrics.md), [Worked example](../07_Metrics_and_K_Values/07_Metric_Calculation_Worked_Example.md).

---
