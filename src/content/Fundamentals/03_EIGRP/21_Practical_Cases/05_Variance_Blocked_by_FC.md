# Case: Variance blocked by feasibility condition

## Topology

```text
         1G delay 10
   R1 ---------------- R3
    |                  |
    | 100M delay 100   |  (path via R2 slower)
    +------ R2 --------+
Destination NET behind R3; R1 wants unequal-cost share via R2
```

## Symptom

Engineer sets `variance 4` on R1. Traffic still uses only the R1→R3 path. `show ip route` shows single next-hop.

## Evidence

```text
! R1
show ip protocols | include Variance
! Variance: 4
show ip eigrp topology 10.9.9.0/24
! successor via R3, FD = 100000
show ip eigrp topology all-links
! via R2: RD (advertised) = 150000  metric = 250000
! RD 150000 is NOT < FD 100000 → fails FC
```

Variance would allow metric ≤ 4 × FD = 400000, and 250000 qualifies—but **FC fails first**, so the path never becomes a feasible successor.

## Root cause

Feasibility condition: neighbor’s advertised distance must be **strictly less** than local FD. R2’s path to NET is worse than R1’s current FD, so R2 is loop-risk from DUAL’s perspective. Variance cannot override FC.

## Fix

Improve the backup path so RD < FD, e.g. lower delay on R2→R3, or accept single-path. Example:

```text
! on R2 toward R3
interface GigabitEthernet0/1
 delay 20
!
! R1 after reconvergence
show ip eigrp topology all-links
! RD via R2 now < FD
show ip route 10.9.9.0
! two next-hops if variance still set
```

## Interview takeaway

“If variance does nothing, check FC in `all-links`—RD must be < FD before variance matters.”

## Related

- [Variance Not Load Sharing](../20_Troubleshooting/08_Variance_Not_Load_Sharing.md)
- [Unequal Delay Tuning Mistake](12_Unequal_Delay_Tuning_Mistake.md)

---
