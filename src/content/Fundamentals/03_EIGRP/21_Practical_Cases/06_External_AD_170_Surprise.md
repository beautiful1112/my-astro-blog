# Case: External AD 170 surprise

## Topology

```text
OSPF domain ---- BR1 ---- EIGRP AS 100 ---- Campus
Prefix 10.20.20.0/24 originates in OSPF
BR1: redistribute ospf into eigrp (seed OK)
Also: BR1 still runs OSPF on a backup interface toward the same prefix
```

## Symptom

Campus sees `D EX` for 10.20.20.0/24. On BR1 itself, `show ip route` shows **OSPF**, not EIGRP. Engineer thinks redistribution “failed” on BR1. A floating path preference ticket starts.

## Evidence

```text
! BR1
show ip eigrp topology 10.20.20.0/24
! External present, AD attributes show external
show ip route 10.20.20.0
! O 10.20.20.0/24 [110/xx]  << winner
! D EX would be [170/…]
show ip protocols
```

Downstream EIGRP routers install D EX (170) correctly; only BR1 prefers OSPF 110 locally.

## Root cause

Cisco default: **EIGRP external AD = 170** > OSPF **110**. Redistribution into EIGRP does not make BR1 prefer its own EIGRP copy over native OSPF. This is expected, not a seed-metric failure.

## Fix

Clarify design intent:

- If BR1 should forward via OSPF to the source: OK—no change.
- If EIGRP path must win on BR1: tune distance carefully **and** prevent loops with tags:

```text
router eigrp 100
 distance eigrp 90 95
! external 95 < OSPF 110 — document risk
```

Prefer fixing topology (avoid competing sources on the same box) over global AD games.

## Interview takeaway

“D EX default AD 170 loses to OSPF 110—redistribution working does not mean the redistributor’s RIB shows D EX.”

## Teaching lab

On BR1, shut the OSPF path and watch RIB move to D EX 170; unshut and watch OSPF 110 reclaim. That single demo permanently fixes the misconception.

## Related

- [Administrative Distances](../15_Redistribution_and_AD/01_Administrative_Distances.md)
- [Route in Topology Not in RIB](../20_Troubleshooting/05_Route_in_Topology_Not_in_RIB.md)

---
