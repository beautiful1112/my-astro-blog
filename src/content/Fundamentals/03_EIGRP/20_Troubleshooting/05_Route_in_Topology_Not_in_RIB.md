# Route in topology not in RIB

EIGRP knows the prefix (successor exists) but `show ip route P` shows another source—or nothing installed from EIGRP.

## Typical reasons

| Reason | Evidence |
|---|---|
| Better AD wins | Static/eBGP/OSPF entry present |
| EIGRP external 170 loses to OSPF 110 | `D EX` in topology, `O` in RIB |
| Distribute-list blocking install | Rare platform nuances; check filters |
| Prefix suppressed / admin distance max | Distance config |
| Waiting Active | Temporary |

```text
show ip eigrp topology 10.10.10.0/24
show ip route 10.10.10.0
show ip protocols
```

RIB line shows winner `[AD/metric]`. Topology may still display EIGRP candidate.

## External AD surprise

Redistributed prefixes are **170**. Operators “expect EIGRP to win” and miss OSPF owning the RIB ([case](../21_Practical_Cases/06_External_AD_170_Surprise.md)).

## Fixes (policy, not hacks)

1. If EIGRP should win: retag design, inject as internal where appropriate, or tune `distance` deliberately with documentation.
2. If OSPF should win: leave defaults; fix redistribution direction.
3. Avoid floating statics colliding unintentionally.

## Verification

```text
show ip route 10.10.10.0
! D or D EX as intended
traceroute 10.10.10.1
```

## Interview framing

“Topology ≠ RIB—AD decides installation; remember EIGRP external is 170 and loses to OSPF.”

## Static AD 1 collision

A leftover floating static with AD 1 (or even AD 100) can hide EIGRP. Always `show ip route P` and read the code letter before retuning EIGRP distance.

```text
show ip route 10.10.10.0 longer-prefixes
show run | include ip route 10.10.10
```

## Related

- [Administrative Distances](../15_Redistribution_and_AD/01_Administrative_Distances.md)
- [External AD 170 Surprise](../21_Practical_Cases/06_External_AD_170_Surprise.md)
- [Troubleshooting Framework](01_Troubleshooting_Framework.md)

---
