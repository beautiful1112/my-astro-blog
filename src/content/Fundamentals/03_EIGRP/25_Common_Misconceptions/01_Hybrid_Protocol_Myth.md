# Misconception: EIGRP Is a Hybrid of Link-State and Distance-Vector

## The myth

“EIGRP is a hybrid protocol—part OSPF, part RIP.”

## Why it is wrong

EIGRP does **not** flood a link-state database or run SPF over a full topology graph. It exchanges **distance-vector** reachability (partial, bounded updates) and uses **DUAL** for loop-free selection and diffusion when needed. “Hybrid” was marketing shorthand for “smarter than classic DV,” not a third flooding model.

## Counterexample topology

```text
R1 ---- R2 ---- R3 ---- R4
         |
        Dest
```

When R2 loses Dest with no FS, it **Queries** neighbors—it does not flood an LSA describing every link R3–R4. R1 never learns the R3–R4 link state; it only learns vectors (metrics) to Dest. Contrast OSPF: every router in the area would install LSAs for those links and recompute SPF.

## Ops symptom table

| If you believe “hybrid/LS” | What you actually see |
|----------------------------|------------------------|
| Expect full AS topology on every router | `show ip eigrp topology` shows prefixes/paths, not every link |
| Expect SPF after any remote link change | Changes may be silent until Query/Active without local FS |
| Troubleshoot like OSPF LSDB sync | Correct path: neighbors → topology Passive/Active → RIB |

## What is true

- Triggered, partial updates (not periodic full-table RIP-like dumps by default)
- Neighbor discovery and RTP reliability
- Feasibility Condition + Queries (diffusing computations)
- Still: routers advertise **vectors** to destinations, not raw LSAs of every link

## Correct habit

Say: **advanced distance-vector with DUAL**. Compare to OSPF/IS-IS on flooding, databases, and UCMP deliberately—not with the hybrid buzzword.

## Related

- [Advanced distance vector](../02_Fundamentals/03_Advanced_Distance_Vector.md)
- [EIGRP vs OSPF vs IS-IS](../02_Fundamentals/06_EIGRP_vs_OSPF_vs_IS_IS.md)
- [DUAL overview](../08_DUAL_and_Feasibility/01_DUAL_Overview.md)
- [Three EIGRP tables](../06_Topology_Table_and_RIB/01_Three_EIGRP_Tables.md)

---
