# Lab: Force Active (No FS)

## Objective

Force a prefix into **Active** by removing the successor when no feasible successor exists; observe Query/Reply diffusion and return to Passive (or withdrawal) with a clear timeline.

## Prerequisites / skills practiced

- Difference between Passive local repair and Active diffusion
- Who gets Queried and how Replies bound the computation
- Reading `show ip eigrp topology active`
- Safe, scoped use of event history / packet debug

## Topology and addressing

```text
Linear path — R1 has no alternate that passes FC to R3 Lo0:

  R1 ---------------- R2 ---------------- R3
                 192.0.2.0/24      198.51.100.0/24

  R1 Gi0/0: 192.0.2.1/24
  R2 Gi0/0: 192.0.2.2/24      R2 Gi0/1: 198.51.100.2/24
  R3 Gi0/0: 198.51.100.3/24
  R1 Lo0: 203.0.113.1/32   R2 Lo0: 10.2.2.2/32   R3 Lo0: 10.3.3.3/32
```

Do **not** add an R1–R3 link. Confirm R1’s topology for `10.3.3.3/32` lists a single successor via R2 and **no FS**.

## Configuration steps

1. Classic EIGRP AS 100 on all three routers; `network` statements for both links and loopbacks; `no auto-summary`.
2. On R1:

```text
show ip eigrp topology 10.3.3.3/32
show ip eigrp topology all-links
```

Confirm one successor only. If a second path appears somehow, remove it or raise its RD until FC fails.

3. Enable light observability (pick one approach):

```text
! Prefer event history over blanket debug in shared labs
show ip eigrp events
! Optional, R2 only, brief:
debug eigrp packets query reply
```

4. Inject failure: `shutdown` on R1’s interface toward R2, **or** shut R2–R3, **or** remove R3 Lo0 from EIGRP.
5. Immediately on R1 (and R2 as applicable):

```text
show ip eigrp topology active
show ip eigrp topology 10.3.3.3/32
```

6. Restore the path; confirm Passive and RIB reinstall. Record wall-clock: failure → Active → Passive.

## Expected show-output checkpoints

| Phase | What to see |
|-------|-------------|
| Steady | Passive; single successor via R2; no Active list |
| After loss | Prefix **Active** on routers that lost successor without FS |
| During Active | Queries toward remaining neighbors; Reply with metric or unreachable |
| After Reply | Passive with new successor, or route removed if unreachable |

`show ip route 10.3.3.3` should lose the `D` entry while Active without a temporary FS, then return or stay absent based on Reply content.

## Failure injection

| Injection | Expected symptom |
|-----------|------------------|
| ACL drop proto 88 on return path briefly | Prolonged Active; approach SIA (Lab 10)—keep short |
| Distribute-list hide alternate that would have been FS | Same Active behavior as “no FS” |
| Clear neighbor mid-Active | Extra churn; not a design fix |
| Restore link before Reply completes | May settle Passive quickly |

## Verification checklist

- [ ] Pre-failure topology proves **zero** FS
- [ ] Active flag captured with timestamp; queried neighbors identified
- [ ] Passive or withdrawal after Reply documented
- [ ] Contrast notes vs Lab 02 (FS present → no Active)

## Write-up / interview reflection

1. Why was there no local repair on R1?
2. Which neighbors were Queried, and which were not?
3. Estimate the timeline: failure → Active → Passive (seconds).
4. If R2–R3 fails vs R1–R2 fails, how do Replies differ?

## Related

- [Going Active and Queries](../08_DUAL_and_Feasibility/06_Going_Active_and_Queries.md)
- [Reply processing and new successor](../08_DUAL_and_Feasibility/07_Reply_Processing_and_New_Successor.md)
- [Query propagation](../09_Query_Scope_and_Convergence/01_Query_Propagation.md)
- [How Replies bound the computation](../09_Query_Scope_and_Convergence/02_How_Replies_Bound_the_Computation.md)

---
