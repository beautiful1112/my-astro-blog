# Route maps with EIGRP

Route-maps provide richer policy than distribute-lists alone: match on prefix-lists, tags, metrics; set metrics, tags; gate redistribution; drive leak-maps and stub leak exceptions.

## Common EIGRP uses

| Use | Pattern |
|---|---|
| Redistribution in/out | `redistribute ospf 1 route-map OSPF-TO-EIGRP` |
| Leak-map for summary | `summary-address … leak-map LEAK` |
| Stub leak-map | `eigrp stub … leak-map …` |
| Tagging | `set tag` on redistribute; match tag later to block loops |
| Metric on redistribute | `set metric` bandwidth delay reliability load MTU |

## Redistribution skeleton (classic)

```text
route-map OSPF-TO-EIGRP deny 10
 match tag 100
route-map OSPF-TO-EIGRP permit 20
 set tag 200
 set metric 100000 100 255 1 1500

router eigrp 100
 redistribute ospf 1 route-map OSPF-TO-EIGRP
```

Tagging prevents re-redistribution loops between EIGRP and OSPF/BGP.

## Named mode

Redistribution and many match/set policies live under the address-family / topology base:

```text
router eigrp CORP
 address-family ipv4 unicast autonomous-system 100
  topology base
   redistribute ospf 1 route-map OSPF-TO-EIGRP
  exit-af-topology
```

## Match caveats

- Matching “metric” in route-maps for EIGRP learned routes is limited compared to BGP communities—prefer tags and prefix-lists.
- Order matters: first matching clause wins.
- Implicit deny at end of route-map used as redistribute filter blocks unmatched routes.

## Verification

```text
show route-map
show ip eigrp topology
show ip route
show ip protocols
```

## Risks

- Silent deny on redistribute route-map empty-match.
- Tag collisions between teams.
- Setting absurd metrics that pass FC oddly or never install.

## Interview framing

“Route-maps gate redistribution, leak-maps, and tags for loop prevention. Prefer prefix-list + tag discipline over one-off metric hacks.”

## Related

- [Distribute lists and prefix lists](04_Distribute_Lists_and_Prefix_Lists.md)
- [Leak maps and specifics](../10_Summarization/06_Leak_Maps_and_Specifics.md)
- [Stub options](02_Stub_Options.md)

---
