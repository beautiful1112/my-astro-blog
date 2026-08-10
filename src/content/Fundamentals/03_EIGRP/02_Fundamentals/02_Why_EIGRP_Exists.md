# Why EIGRP exists

EIGRP was built for **enterprise campus and WAN** domains where operators wanted faster, more scalable dynamic routing than classic RIP, without always taking on OSPF/IS-IS operational weight—especially when **unequal-cost load balancing**, simple stub leaf design, and Cisco-centric ops were acceptable.

## Versus RIP

| Pain with RIP | EIGRP response |
|---|---|
| Slow periodic full (or largely periodic) updates | Event-driven, **partial** updates |
| Hop-count metric, small diameter | Composite bandwidth/delay metric, larger practical diameter |
| Poor loop control under churn | DUAL feasibility condition + Active queries |
| Limited stub/query tools | Stub, summarization, bounded query domain |

RIP can still appear at edges, but it is not a serious campus/WAN core choice when EIGRP or a link-state IGP is available.

## Versus OSPF (and IS-IS)

OSPF/IS-IS remain the multi-vendor and many “clean architecture” defaults. EIGRP still wins conversations when:

- **Ops simplicity** in an all-Cisco estate matters more than SPF literacy across vendors;
- **Unequal-cost multipath (variance)** is a first-class traffic-engineering need without MPLS TE;
- **Stub routers** and summarization give an intuitive way to **bound queries** after failures;
- WAN designs historically tuned **delay/bandwidth** interface knobs rather than OSPF cost alone.

| Need | Often lean EIGRP | Often lean OSPF/IS-IS |
|---|---|---|
| Multi-vendor IGP | Weak | Strong |
| UCMP without extra TE | Variance | Limited / different tools |
| Full topology visibility | Topology via neighbors only | LSDB / SPF view |
| Service-provider PE-CE | Sometimes (Cisco PE-CE) | Common (OSPF) + BGP |
| Internet-scale policy | Not the tool | Not the tool (use BGP) |

Related: [EIGRP versus OSPF versus IS-IS](06_EIGRP_vs_OSPF_vs_IS_IS.md), [Advanced distance vector](03_Advanced_Distance_Vector.md).

## Enterprise niche (where it still shows up)

```text
Campus access/distribution (Cisco)
  -> EIGRP AS 100, stubs at access
WAN dual-homed branches
  -> variance or primary/backup delay tuning
Legacy mergers
  -> redistribution islands until BGP/OSPF consolidation
```

Modern greenfield designs often pick OSPF or IS-IS (or even BGP underlay). Knowing *why* EIGRP existed—and where it still runs—matters for brownfield interviews and outages.

## Configuration patterns (stub as a “why” feature)

### Cisco IOS / IOS XE

```text
router eigrp 100
 network 10.0.0.0 0.0.255.255
 eigrp stub connected summary
```

Named mode places stub under the address-family. Stub is a design answer to query scope, not a trivia flag.

## Verification

```text
show ip eigrp neighbors detail
show ip protocols
show ip eigrp topology
```

Confirm stub flags on neighbors and that core routers stop expecting certain query answers from leaves.

## Risks

- Choosing EIGRP “because Cisco” without stub/summary design → SIA risk under failure.
- Promising multi-vendor EIGRP parity from RFC 7868 alone.
- Using EIGRP as Internet edge policy—that is BGP’s job.

## Interview framing

“EIGRP exists for enterprise Cisco-centric domains that want DV-style simplicity with DUAL convergence, UCMP via variance, and stub/summary query bounding—trading away multi-vendor LSDB visibility that OSPF/IS-IS provide.”

---
