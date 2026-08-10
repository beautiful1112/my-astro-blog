# Lab: Variance UCMP

## Objective

Install unequal-cost EIGRP paths with `variance` **only** when the Feasibility Condition passes; prove that a high variance cannot install a path that fails FC.

## Prerequisites / skills practiced

- Successor metric vs alternate composite vs RD/FD
- `variance` and `maximum-paths` interaction
- CEF multipath observation vs single-flow hashing illusion
- UCMP pitfalls (FC gate, traffic-share, operational surprises)

## Topology and addressing

```text
           R1
          /  \
    slow /    \ fast   (raise delay on slow side)
      R2 ------ R3
                Lo0 10.3.3.3/32

  R1–R2: 192.0.2.0/24     (.1=R1, .2=R2)
  R1–R3: 198.51.100.0/24  (.1=R1, .3=R3)  ← preferred
  R2–R3: 10.0.23.0/24     (.2=R2, .3=R3)
  R1 Lo0: 203.0.113.1/32
```

Tune so successor to `10.3.3.3/32` is via R3; via R2 is worse but still **RD &lt; FD**.

## Configuration steps

1. EIGRP AS 100 triangle; advertise dest loopback; `no auto-summary`.
2. Baseline on R1:

```text
router eigrp 100
 maximum-paths 4
! variance defaults to 1 → single best path in RIB
show ip eigrp topology 10.3.3.3/32
show ip route 10.3.3.3
```

Record successor metric **S** and alternate local metric **A**; confirm alternate is FS (RD &lt; FD).

3. Compute ratio `ceil(A/S)`. Set variance **just below** that integer; confirm still one RIB path.
4. Set variance **at or above** the ratio:

```text
router eigrp 100
 variance 2
```

(Use the smallest integer that admits the alternate.)

5. Confirm UCMP: two next hops in `show ip route` / `show ip cef`.
6. Destroy FC: increase delay on the alternate until RD ≥ FD. Raise `variance 128`—alternate must **still not** install.

## Expected show-output checkpoints

```text
show ip eigrp topology 10.3.3.3/32
show ip route 10.3.3.3
show ip cef 10.3.3.3
show ip protocols | section eigrp
```

| Step | Expected |
|------|----------|
| variance 1 | One RIB next hop; FS may exist in topology |
| variance ≥ A/S and FC pass | Two next hops; CEF multipath |
| FC fail, variance huge | Path without FS; RIB single-path |
| `maximum-paths 1` | Single path even with high variance |

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| `maximum-paths 1` | UCMP blocked regardless of variance |
| Single-flow ping “proves” no UCMP | Per-dest CEF hash—use multiple sources or `show ip cef` |
| Offset-list push alternate past variance window | Path drops out of UCMP set |

## Verification checklist

- [ ] Numeric S, A, RD, FD, and variance threshold recorded
- [ ] Proof that FC blocked a path inside a huge variance
- [ ] CEF shows both next hops when UCMP valid
- [ ] maximum-paths interaction tested

## Write-up / interview reflection

1. Exact metrics and variance that first allowed UCMP?
2. How did you prove FC—not variance—blocked the unequal path?
3. Did CEF list both next hops (avoid single-flow hash trap)?
4. Is every FS automatically used for UCMP when variance is large enough?

## Related

- [Variance unequal cost](../12_Load_Balancing/02_Variance_Unequal_Cost.md)
- [Maximum paths](../12_Load_Balancing/03_Maximum_Paths.md)
- [UCMP pitfalls](../12_Load_Balancing/06_UCMP_Pitfalls.md)
- [Feasibility condition](../08_DUAL_and_Feasibility/03_Feasibility_Condition.md)
- [Case: variance blocked by FC](../21_Practical_Cases/05_Variance_Blocked_by_FC.md)

---
