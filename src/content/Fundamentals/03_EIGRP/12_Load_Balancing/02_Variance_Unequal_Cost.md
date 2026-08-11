# Variance unequal cost

**Variance** enables **unequal-cost multipath (UCMP)**: EIGRP may install worse-metric paths alongside the successor if they fall within a metric window **and** pass the feasibility condition.

## Rules (both required)

1. **Variance window**: candidate local metric ≤ `variance × FD` (FD = successor metric).
2. **Feasibility condition**: candidate’s **RD &lt; FD** (must be FS or successor).

Variance alone never installs a path that fails FC. This is the classic interview trap.

```text
variance multiplier n  (integer ≥ 1; 1 = ECMP only)
```

```text
Candidate path --> metric ≤ variance × FD?
V --no--> Not installed
V --yes--> RD < FD?
FC --no--> Not installed / even if in window
FC --yes--> Install next hop / UCMP
```

## Configuration

```text
! Classic
router eigrp 100
 variance 2
 maximum-paths 4

! Named
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   variance 2
   maximum-paths 4
```

## Mental model

Successor metric 100; variance 2 → local metrics ≤ 200 may install **if** RD &lt; 100. A path with metric 150 but RD 120 fails FC and stays out of the RIB despite fitting the window.

## Verification

```text
show ip eigrp topology 10.1.1.0/24
show ip route 10.1.1.0
```

Confirm which `via` lines are successors vs FS, then which appear in `show ip route`.

## Interview framing

“Variance multiplies FD for the metric window; FC still mandatory. No FS → no UCMP on that path.”

## Related

- [Feasibility condition](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md)
- [UCMP worked example](05_UCMP_Worked_Example.md)
- [UCMP pitfalls](06_UCMP_Pitfalls.md)

---
