# Variance not load sharing

`variance N` configured but traffic still uses one path. Variance only installs paths that already pass the **feasibility condition** and whose metric is within N × FD.

## Rules recall

1. Neighbor’s advertised distance (RD) < local feasible distance (FD) → FS eligible.
2. Path metric ≤ variance × FD → can enter RIB for sharing.
3. Maximum-paths caps how many install.

If FC fails, variance **never** installs that path ([case](../21_Practical_Cases/05_Variance_Blocked_by_FC.md)).

## Evidence

```text
show ip eigrp topology P
show ip eigrp topology all-links
show ip route P
show ip protocols | include Variance|Maximum
```

In `all-links`, check RD vs FD. If RD ≥ FD, path is not feasible—raising variance is useless.

## Fixes

| Goal | Action |
|---|---|
| Make backup feasible | Improve backup metric (delay/BW) so RD < FD |
| Share among feasibles | Set variance appropriately + max-paths |
| Unequal share ratios | CEF shares by metric inverse (approx); do not expect perfect % |

Do not disable FC (there is no safe “variance ignore FC” knob)—fix metrics instead.

## Interview framing

“Variance cannot override feasibility; if RD ≥ FD the path stays out regardless of variance.”

## CEF sharing reality

Even with multiple EIGRP paths installed, per-flow CEF may pin elephant flows to one path. Prove with `show ip cef` and multiple flow hashes before declaring variance broken.

## Checklist

- [ ] `variance` and `maximum-paths` configured
- [ ] Backup visible in `all-links`
- [ ] RD < FD (FC pass)
- [ ] Path metric ≤ variance × FD
- [ ] CEF shows multiple adjacencies
- [ ] Test with multiple 5-tuples if elephant flow suspected

## Interview trap

Candidates who say “raise variance until it shares” fail if they never mention feasibility. Always state FC before variance arithmetic.

## Related

- [Variance Blocked by FC](../21_Practical_Cases/05_Variance_Blocked_by_FC.md)
- [Load Balancing module](../12_Load_Balancing/)
- [Unexpected Metrics](07_Unexpected_Metrics.md)

---
