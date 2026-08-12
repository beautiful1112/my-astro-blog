# Fast convergence design

Fast convergence is a **budget**: detect, describe, compute, install, and (for L3) sometimes repair locally. Tuning one timer without the rest is theater.

## Four necessary pieces (any IGP)

1. **Failure detection** — BFD or fast carrier; not 40 s hellos if RTO is 1 s.
2. **Event propagation** — LSA/LSP/query bounded by area/level/stub.
3. **Computation** — SPF/DUAL scoped; prefix-priority if needed.
4. **RIB/FIB install** — including LFA/TI-LFA/FRR or FS for local repair.

Micro-bursts and physical flapping (CCDE v3.1) make naive sub-second hellos dangerous: you converge into a storm. Dampen, hold down, or fix the physical layer.

```text
Detect (BFD) -> flood/query (bounded) -> SPF/DUAL -> FIB
Optional: LFA/SR-TI-LFA / EIGRP FS  (repair before full compute)
```

## Design vs timer tweaks

A huge flat domain will not meet a 200 ms RTO no matter how low you set SPF throttle. First **shrink the domain**, then add BFD, then FRR.

## Interview framing

“I buy fast convergence by bounding the domain and detecting honestly—BFD plus local repair—not by setting every timer to zero on a continent-sized area.”

---
