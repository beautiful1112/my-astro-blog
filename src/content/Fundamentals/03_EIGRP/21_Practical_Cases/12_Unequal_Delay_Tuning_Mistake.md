# Case: Unequal delay tuning mistake

## Topology

```text
Primary: R1—R3 delay 1 (too aggressive)
Backup:  R1—R2—R3 delay left default
Goal: prefer primary but keep backup as FS for fast failover
Engineer also sets variance 2 hoping for share
```

## Symptom

Primary works until it fails—then long Active/convergence instead of instant FS failover. Sometimes backup never becomes FS. After “fixing” delays randomly, traffic blackholes toward a suboptimal hub.

## Evidence

```text
show interface <primary> | include Dly
! Dly 10 usec (delay 1)
show ip eigrp topology NET
! FD extremely low via primary
show ip eigrp topology all-links
! backup RD >> FD → fails FC
```

Because FD is tiny on the hyper-tuned primary, almost no alternate can satisfy RD < FD.

## Root cause

Over-lowering delay on the primary **crushes FD**, making feasibility of backups impossible. Variance does not help. Classic mistake when chasing path preference without watching FC.

## Fix

Set delays from a coherent TE plan so backup RD stays below primary FD:

```text
! example relative values — lab and validate
interface Gi0/0  ! primary toward R3
 delay 100
interface Gi0/1  ! toward R2
 delay 200
!
show ip eigrp topology all-links
! backup RD < FD → FS present
```

Prefer bandwidth/delay matrices over one-off `delay 1` hacks. Test link fail: should switch without Active if FS exists.

## Interview takeaway

“Aggressive delay on primary can destroy feasible successors—tune so backups still pass FC, then use variance only if sharing is required.”

## Rule of thumb

After any delay change on the primary, immediately re-check `all-links` for FS. If FS disappeared, roll back or raise primary delay until FC passes—preference is useless without safe failover.

## Related

- [Variance Blocked by FC](05_Variance_Blocked_by_FC.md)
- [Unexpected Metrics](../20_Troubleshooting/07_Unexpected_Metrics.md)

---
