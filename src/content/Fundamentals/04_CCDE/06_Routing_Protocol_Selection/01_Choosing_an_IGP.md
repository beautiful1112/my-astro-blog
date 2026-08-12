# Choosing an IGP

An IGP’s job is **underlay reachability inside a failure-domain budget**. BGP’s job is **policy and scale across domains**. Mixing the jobs is a common CCDE trap.

## Quick selection

| Protocol | Natural fit | Awkward fit |
|---|---|---|
| **OSPF** | Enterprise campus/DC, multi-vendor, area hierarchy | Huge WAN with poor summarization, very large LSDB |
| **IS-IS** | SP/core, MPLS/SR, dual-stack TLVs, fast conv culture | Small IT shops with no IS-IS skill (constraint) |
| **EIGRP** | Cisco-heavy enterprise, hub-spoke with stub | Multi-vendor core, Internet-scale policy |
| **RIP** | Tiny leftover | Anything with a real RTO |
| **BGP** | Edges, DC fabric scale, multitenancy, Internet | Replacing a 20-router campus IGP “because cloud” |

Skill and installed base are **constraints**. A theoretically prettier IS-IS core that nobody can troubleshoot at 03:00 is a bad design if the constraint is a two-person NOC.

## Dual IGP

Two IGPs (migration, merger, PE-CE) need a **planned seam** (BGP or one-way redistribute with tags). Eternal mutual redistribution is not a strategy.

## Interview framing

“I pick an IGP for topology and who can operate it. I pick BGP when I need policy or domain isolation. I do not pick a protocol because it won a feature checklist.”

Related: [OSPF design](../07_OSPF_Design/README.md), [IS-IS](../08_ISIS_Design/README.md), [EIGRP and BGP](../09_EIGRP_and_BGP_Design/README.md).

---
