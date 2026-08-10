# Redistribution failures

Prefixes do not cross protocol boundaries, or they loop. Separate **into EIGRP** vs **from EIGRP**.

## Into EIGRP silent failure

| Cause | Check |
|---|---|
| No seed metric | `default-metric` / `metric` on redistribute |
| Route-map deny | `show route-map` |
| Source route absent | OSPF/BGP table on border |
| Tag deny | match tag blocking |

```text
show ip eigrp topology P
! External attributes / infinite metric clues
show run | section redistribute
```

## From EIGRP silent failure

| Cause | Check |
|---|---|
| Missing `subnets` into OSPF | Only majors appear |
| Match route-type too strict | internals only vs need externals |
| Prefix-list | allow-list gaps |
| BGP deny outbound | elsewhere |

## Loop symptoms

Flapping AD winners, duplicate paths, traceroute circles → tags missing ([Mutual Redistribution Loops](../15_Redistribution_and_AD/06_Mutual_Redistribution_Loops.md)).

## Verification lab pattern

1. Unique prefix on each side of boundary.
2. Confirm one-way appearance with correct tag.
3. Confirm no re-entry as foreign protocol route.
4. Fail primary border; retest on secondary.

## Interview framing

“Into EIGRP failures are usually seed metric or route-map; loops are missing deny-own-tag on mutual redistribution.”

## Named-mode topology base

In named mode, redistribution often lives under `topology base`. Mis-placed `redistribute` at the wrong hierarchy level looks like “IOS ignored me.” Always `show run | section router eigrp`.

## External bit checklist

When a prefix appears as D EX unexpectedly inside a “pure” campus, trace originating router ID in topology—someone redistributed upstream. That is not a local seed-metric bug; it is policy scope.

## Seed vs filter order

Route-map deny means seed metric never matters. Debug denies first (`show route-map` match counts where supported), then seed.

## Related

- [Redistributing into EIGRP](../15_Redistribution_and_AD/02_Redistributing_into_EIGRP.md)
- [Mutual Redistribution Loop case](../21_Practical_Cases/09_Mutual_Redistribution_Loop.md)
- [Filtering Redistributed Routes](../15_Redistribution_and_AD/05_Filtering_Redistributed_Routes.md)

---
