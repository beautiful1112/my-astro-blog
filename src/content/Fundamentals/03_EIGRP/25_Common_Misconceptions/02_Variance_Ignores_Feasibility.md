# Misconception: Variance Installs Any Unequal Path Within N×

## The myth

“Set `variance 2` (or 128) and EIGRP load-shares every path within that multiple.”

## Why it is wrong

Variance only considers paths that are already **loop-free under the Feasibility Condition** (successor or FS). A path with metric ≤ N × successor metric but **RD ≥ FD** is **not** installed. Variance never overrides DUAL.

## Counterexample (numeric)

```text
R1 has successor via R2 to Dest:
  FD = successor composite = 10_000
Alternate via R3:
  local composite = 15_000  (within variance 2 → 20_000)
  RD from R3 = 10_500
FC: is 10_500 < 10_000? NO → not an FS
```

Even with `variance 128` and `maximum-paths 4`, RIB stays single-path via R2. Topology may list R3 under `all-links` without FS flag.

```text
        Dest
       /    \
     R2      R3
       \    /
         R1
```

Raise R3’s delay until RD &lt; FD while keeping composite ≤ 2×FD—then variance 2 can install UCMP.

## Ops symptom table

| Symptom | Likely cause |
|---------|----------------|
| High variance, still one next hop | Alternate fails FC |
| Topology shows path, RIB does not | Not FS / variance / max-paths |
| CEF one adjacency despite two routes | Per-dest hash / single flow—or only one path installed |

## Correct habit

Check `show ip eigrp topology <prefix>` for FS **before** tuning variance. UCMP needs **FC and variance and maximum-paths**. Local repair needs FC even when you do not want UCMP.

## Related

- [Variance unequal cost](../12_Load_Balancing/02_Variance_Unequal_Cost.md)
- [UCMP pitfalls](../12_Load_Balancing/06_UCMP_Pitfalls.md)
- [Feasibility condition](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md)
- [Case: variance blocked by FC](../21_Practical_Cases/05_Variance_Blocked_by_FC.md)
- [Lab: Variance UCMP](../23_Labs/06_Variance_UCMP.md)

---
