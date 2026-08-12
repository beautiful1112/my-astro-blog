# Interview: IGP and BGP design

## Q1 — OSPF vs IS-IS vs EIGRP?

**Model:** Skill + topology + scale. OSPF enterprise areas; IS-IS large dual-stack MPLS/SR; EIGRP Cisco hub-spoke with stubs. Not a beauty contest.

## Q2 — Why not dump BGP into OSPF?

**Model:** Prefix/churn explosion; IGP is underlay. Inject default or few aggregates.

## Q3 — EIGRP query domain?

**Model:** Stub + summary bound queries; flat AS → SIA risk.

## Q4 — When RR vs full mesh?

**Model:** iBGP O(n²); paired diverse RRs; RR is control-plane.

## Q5 — Summarization side effect?

**Model:** Suboptimal routing and blackholes without discard; sometimes intended for stability.

## Cross-links

[Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md), [Query bounding](../09_EIGRP_and_BGP_Design/02_Query_Bounding_in_Design.md).

---
