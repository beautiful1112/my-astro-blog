# Case: K-values mismatch (silent)

## Topology

```text
R1 Gi0/0 ---- Gi0/0 R2
EIGRP AS 100 on both; same subnet 10.0.0.0/30
```

```text
R1 K=1 0 1 0 0 --> R2 K=1 0 1 1 0
```

## Symptom

New WAN link never shows a neighbor. Ping between interface IPs succeeds. Ops assumes ACL or auth; both are clean.

## Evidence

```text
! R1
show ip protocols | include K
! K-values: 0 1 0 1 0 0
show ip eigrp neighbors
! empty
show ip eigrp interfaces
! Gi0/0 present
!
! R2
show ip protocols | include K
! K-values: 0 1 0 1 1 0   << K4 differs
```

Packet capture: hellos exchanged both ways; adjacency never completes. Syslog may be quiet compared to auth failures—classic “silent” mismatch.

## Root cause

EIGRP requires **identical K-values** on neighbors. R2 had `metric weights 0 1 0 1 1 0` left from an old load-tracking experiment. Hellos are ignored for adjacency purposes when K TLV disagrees.

## Fix

```text
! R2 — align to enterprise standard (K1/K3 only)
router eigrp 100
 metric weights 0 1 0 1 0 0
```

Verify:

```text
show ip eigrp neighbors
! R1 uptime starts
show ip eigrp topology
```

Document standard K-vector in the design guide; treat any change as dual-sided maintenance.

## Interview takeaway

“K-value mismatch prevents neighbors even when ping and AS match—always compare `show ip protocols` K-values on both ends.”

## Related

- [Neighbors Not Forming](../20_Troubleshooting/02_Neighbors_Not_Forming.md)
- [Logging and Change Control](../19_Operations_and_Observability/05_Logging_and_Change_Control.md)

---
