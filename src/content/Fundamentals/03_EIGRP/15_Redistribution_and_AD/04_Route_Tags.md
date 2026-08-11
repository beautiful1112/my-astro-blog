# Route tags

A **route tag** is an opaque integer carried with a redistributed (and often native) route so policy can recognize **provenance**. Tags are the primary loop-prevention tool for mutual redistribution—more reliable than hoping AD alone will save you.

## Where tags live

| Context | Tag behavior |
|---|---|
| Redistributed into EIGRP | Stored in topology; visible as external attribute |
| Redistributed into OSPF | External LSA tag field |
| BGP | Prefer communities; tags also usable on redistribute |
| Route-maps | `set tag` / `match tag` |

EIGRP externals show originating router, remote AS, and tag in `show ip eigrp topology`.

## Tagging conventions (recommended)

| Tag value | Meaning (example scheme) |
|---|---|
| 100 | Originated from / via EIGRP AS 100 |
| 110 | Originated from OSPF process 1 |
| 65000 | Originated from BGP ASN 65000 |
| 999 | Do-not-redistribute / sink |

Pick one scheme per enterprise and document it in the redistribution runbook.

## Apply on export

```text
route-map EIGRP-TO-OSPF permit 10
 match route-type internal
 set tag 100
 set metric 20
 set metric-type type-2
```

## Deny on re-import

```text
route-map OSPF-TO-EIGRP deny 10
 match tag 100
route-map OSPF-TO-EIGRP permit 20
 match ip address prefix-list OSPF-OK
 set tag 110
 set metric 100000 100 255 1 1500
```

```text
EIGRP AS 100 --set tag 100--> OSPF
O --match tag 100 deny--> E
O --set tag 110--> EIGRP import
```

## Verification

```text
show ip eigrp topology 192.0.2.0/24
! Tag = 110 (example)
show ip ospf database external 192.0.2.0
! Tag shown in ASE
show route-map OSPF-TO-EIGRP
```

Lab both directions: inject a unique prefix on each side and prove it does not bounce back.

## Risks

- Tagging on only one redistribution point in a dual-border design.
- Reusing the same tag for conflicting meanings.
- Matching tag but still permitting via a later permit-any clause.

## Interview framing

“Tags mark where a route came from; on the reverse redistribute you deny your own tag. AD is not a substitute for that pattern.”

## Related

- [Mutual Redistribution Loops](06_Mutual_Redistribution_Loops.md)
- [Filtering Redistributed Routes](05_Filtering_Redistributed_Routes.md)
- [Mutual Redistribution Loop case](../21_Practical_Cases/09_Mutual_Redistribution_Loop.md)

---
