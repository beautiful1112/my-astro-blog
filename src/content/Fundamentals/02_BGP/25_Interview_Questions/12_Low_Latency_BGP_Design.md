# Interview: Design BGP for a Low-Latency Trading Site

## Question

Design BGP policy for a colocated trading site with two exchange links and one transit backup.

## Strong answer

Separate **intent classes**: order VIP vs market data vs Internet utility.

1. Distinct LOCAL_PREF tiers: exchange-A > exchange-B ≫ transit for order prefixes.
2. Tight prefix allowlists; no transit export of customer/peer routes.
3. Measure one-way latency; map to stable LP classes with hysteresis—not per-sample flaps.
4. BFD/PIC only with capacity-validated backup and anti-oscillation timers.
5. Monitor best-path and FIB for VIP prefixes; change control with abort thresholds.
6. Optional multipath + link-bandwidth on dual equal exchanges; never ECMP order flows onto undersized backup silently.
7. RPKI reject Invalid on Internet edges; RTBH/FlowSpec playbooks pre-authorized.

State what BGP cannot guarantee (symmetry, absolute latency) and how you verify the data plane.

## Follow-ups

- RR path hiding risk for dual edges?
- GR on exchange sessions—yes/no?
- How do you prove N-1 capacity?

## Cross-links

[Quant module](../22_Quant_Trading_Networks/README.md), [Latency-aware control](../22_Quant_Trading_Networks/03_Latency_Aware_Path_Control.md).

---
