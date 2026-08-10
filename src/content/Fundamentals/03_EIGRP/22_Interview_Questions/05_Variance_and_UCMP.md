# Interview: Variance and UCMP

## Q1 — Variance definition

**Q:** What does `variance N` do?

**Model answer:** Allows installation of feasible paths whose metric is ≤ **N × successor metric**, up to `maximum-paths`. Paths must still be **loop-free under FC** (successor or FS). Variance does not invent unequal-cost paths that fail FC.

**Common wrong answer:** “Variance N load-shares any path within N× regardless of feasibility.”

## Q2 — FC still required

**Q:** Path metric is within variance but RD ≥ FD. Installed?

**Model answer:** **No.** Without passing FC it is not an FS; variance cannot override DUAL loop freedom.

**Common wrong answer:** “Variance bypasses DUAL.”

## Q3 — ECMP vs UCMP

**Q:** When do you get ECMP without variance?

**Model answer:** Equal composite metrics (after K formula) install up to max-paths. Unequal metrics need variance (and FC) for UCMP.

**Common wrong answer:** Claiming EIGRP always UCMP by default.

## Q4 — Traffic-share

**Q:** Role of `traffic-share balanced` vs `min`?

**Model answer:** Influences how traffic is distributed among installed unequal-cost paths (balanced by inverse metric ratios vs preferring minimum metric path among installed set—platform/docs nuance). Does not create additional paths.

**Common wrong answer:** Using traffic-share as a substitute for variance.

## Q5 — CEF caveat

**Q:** Control plane shows multiple EIGRP paths—why might traffic still pin?

**Model answer:** CEF per-destination hashing, polarization, or only one path programmed due to max-paths/variance/FC. Verify `show ip cef` / `show ip route` and actual next hops.

**Common wrong answer:** Blaming EIGRP when CEF hash is sticky for a single flow.

## Q6 — Design interview

**Q:** Is UCMP a good default for WAN?

**Model answer:** Often **no**—unequal sharing can surprise capacity planning; prefer intentional ECMP with delay/BW engineered equality, or primary/backup with FS without variance. Use variance when you knowingly want proportional sharing and have verified FC.

**Common wrong answer:** Enabling variance 128 “to use all links.”

## Q7 — Numeric trap

**Q:** Successor metric 10000; alternate 25000; variance 2. Share?

**Model answer:** 25000 > 2×10000 → **not** eligible even if it were FS. Need variance ≥ 3 and FC pass.

**Common wrong answer:** Installing because “2 is close enough.”

## Cross-links

[Variance](../12_Load_Balancing/02_Variance_Unequal_Cost.md), [UCMP example](../12_Load_Balancing/05_UCMP_Worked_Example.md), [Pitfalls](../12_Load_Balancing/06_UCMP_Pitfalls.md).

---
