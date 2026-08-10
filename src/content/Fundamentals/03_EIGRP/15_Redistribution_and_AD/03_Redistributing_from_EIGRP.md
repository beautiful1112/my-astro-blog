# Redistributing from EIGRP

Exporting EIGRP into OSPF, BGP, IS-IS, or another EIGRP AS is a **policy** problem first and a metric problem second. EIGRP already has a composite metric; the target protocol must map that into its own cost language.

## What leaves EIGRP

| Source in EIGRP | Typical treatment on export |
|---|---|
| Internal (`D`) | Often preferred candidates |
| External (`D EX`) | Easy to create loops if re-imported without tags |
| Summaries | Export only if you intend the summary scope |

Always decide whether to redistribute **internal only**, **external only**, or both (`match internal` / `match external` on Cisco route-maps for EIGRP).

## Into OSPF

```text
router ospf 1
 redistribute eigrp 100 subnets route-map EIGRP-TO-OSPF
!
route-map EIGRP-TO-OSPF permit 10
 match ip address prefix-list EIGRP-OK
 match route-type internal
 set tag 100
 set metric 20
 set metric-type type-2
```

Notes:

- `subnets` is required on classic IOS or only classful nets redistribute.
- OSPF Type-2 external keeps metric constant across the OSPF domain—usually clearer for “came from EIGRP” prefixes.
- Tag `100` (EIGRP AS) so the EIGRP side can deny on re-import.

## Into BGP

```text
router bgp 65000
 address-family ipv4
  redistribute eigrp 100 route-map EIGRP-TO-BGP
!
route-map EIGRP-TO-BGP permit 10
 match ip address prefix-list CAMPUS-AGG
 set origin igp
 set community 65000:100
```

Prefer originating **aggregates** into BGP rather than thousands of leaf prefixes. EIGRP→BGP at the edge is common; EIGRP→BGP→EIGRP without tags is a loop factory.

## Into another EIGRP AS

Treat as mutual redistribution between ASes: different AS numbers do **not** auto-share topology. Use tags, seed metrics, and preferably a single redistribution router (or tightly paired pair).

```text
router eigrp 200
 redistribute eigrp 100 metric 100000 100 255 1 1500 route-map FROM-AS100
```

## Metric mapping intuition

| Target | What to set |
|---|---|
| OSPF | `metric` + `metric-type` 1/2 |
| RIP | hop-count seed |
| BGP | MED optional; usually communities + aggregates |
| EIGRP | full five-component seed |

EIGRP delay/bandwidth do not translate 1:1 into OSPF cost—pick administrative costs that encode **policy**, not false precision.

## Verification

```text
show ip ospf database external
show ip bgp 10.10.0.0
show route-map EIGRP-TO-OSPF
show ip eigrp topology | include Ext
```

On the receiving protocol, confirm tag, metric type, and that denied externals stay out.

## Risks

- Redistributing `D EX` back toward their origin domain.
- Forgetting `subnets` into OSPF.
- Exporting every stub spoke prefix into BGP/WAN IGP.

## Interview framing

“Leaving EIGRP, filter by route-type and prefix, set a tag that identifies the EIGRP AS, and map to a simple target metric—never re-import tagged routes.”

## Related

- [Filtering Redistributed Routes](05_Filtering_Redistributed_Routes.md)
- [Mutual Redistribution Loops](06_Mutual_Redistribution_Loops.md)
- [EIGRP as PE-CE](../18_Scale_and_Design/05_EIGRP_as_PE_CE.md)

---
