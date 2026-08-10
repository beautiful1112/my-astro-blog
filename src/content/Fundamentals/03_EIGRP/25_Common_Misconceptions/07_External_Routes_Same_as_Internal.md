# Misconception: External EIGRP Routes Behave Like Internal

## The myth

“If it shows as EIGRP (`D`), it has AD 90 and is equal to any other EIGRP route.”

## Why it is wrong

Cisco marks redistributed routes as EIGRP **external** with default AD **170**. They lose to OSPF (110) and to EIGRP internal (90). Operators “redistribute into EIGRP” then wonder why OSPF still wins—or why another EIGRP path is preferred.

## Counterexample

```text
R_edge redistributes OSPF 192.0.2.0/24 into EIGRP AS 100
R_core also has OSPF adjacency learning 192.0.2.0/24 (AD 110)

R_core RIB: OSPF wins (110) over D EX (170) — “EIGRP redistribute” never takes over
```

Alternate: same prefix as EIGRP **internal** from a branch (AD 90) vs **external** from redistribution (AD 170)—internal always preferred on that router regardless of metric until AD is changed.

```text
show ip route 192.0.2.0
! D EX 192.0.2.0/24 [170/...] via ...
! vs
! D    192.0.2.0/24 [90/...] via ...
```

## Ops symptom table

| Symptom | Likely cause |
|---------|----------------|
| Redistributed prefix loses to OSPF | External AD 170 vs OSPF 110 |
| Two EIGRP paths; “worse” internal wins | Internal 90 vs external 170 |
| Code looks like `D` but AD 170 | External—read `D EX` / AD column |
| Mutual redis loops | Tags/filters missing—not “same as internal” |

## Correct habit

Read codes: `D EX` (or platform equivalent) → AD **170**. Plan redistribution and AD explicitly; do not assume internal preference.

## Related

- [Administrative distances](../15_Redistribution_and_AD/01_Administrative_Distances.md)
- [Redistributing into EIGRP](../15_Redistribution_and_AD/02_Redistributing_into_EIGRP.md)
- [Route tags](../15_Redistribution_and_AD/04_Route_Tags.md)
- [Case: external AD 170 surprise](../21_Practical_Cases/06_External_AD_170_Surprise.md)
- [Lab: Redistribution with tags](../23_Labs/08_Redistribution_with_Tags.md)

---
