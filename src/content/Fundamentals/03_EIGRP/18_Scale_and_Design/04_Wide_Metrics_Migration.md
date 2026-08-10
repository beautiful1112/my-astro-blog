# Wide metrics migration

Classic EIGRP metrics are 32-bit composite values. **Wide metrics** (64-bit) improve scaling on high-speed links where classic delay/bandwidth formulas lose differentiation (especially >1/10/40/100 Gbps).

## Why wide metrics

| Problem with classic | Wide metrics effect |
|---|---|
| Many interfaces look equal at high BW | Finer delay/BW resolution |
| Unequal-cost intent collapses | Variance/FC more meaningful |
| Mixed speeds hard to tune | Less artificial delay hacking |

Named mode is the natural home for wide metrics.

## Enablement (named mode conceptual)

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  metric version v64
  topology base
   ! confirm exact CLI on your IOS-XE train
```

Exact CLI varies by IOS-XE version—confirm wide-metric feature support before cutover.

## Compatibility rules

| Peer A | Peer B | Result |
|---|---|---|
| Classic | Classic | OK |
| Wide | Wide | OK |
| Classic | Wide | **Mismatch risk** — adjacency or metric interpretation problems |

Migrate by **AS region** or maintenance domain: all neighbors in a peering set must agree.

## Migration steps

1. Inventory classic-only platforms; upgrade or isolate.
2. Lab classic↔wide behavior on your code train.
3. Schedule regional cutover; expect neighbor resets.
4. Re-baseline delay/bandwidth; classic “magic delay” hacks may need revisit.
5. Validate variance/FC assumptions under new metric magnitudes.
6. Update monitoring thresholds (metric values jump in scale).

## Verification

```text
show eigrp plugins
show eigrp address-family ipv4 interfaces detail
show ip eigrp topology
! metric fields show wide values
```

Compare path preference before/after on representative prefixes.

## Risks

- Partial migration in a flat AS.
- Assuming variance percentages still “feel” the same without re-checking FC.
- Forgetting that redistribute seed metrics also feed the new formula.

## Interview framing

“Wide metrics restore differentiation on high-speed links; migrate an entire neighbor domain together—classic and wide are not casually mixed.”

## Related

- [Metrics and K-Values module](../07_Metrics_and_K_Values/)
- [Unexpected Metrics](../20_Troubleshooting/07_Unexpected_Metrics.md)
- [When to Choose EIGRP](06_When_to_Choose_EIGRP.md)

---
