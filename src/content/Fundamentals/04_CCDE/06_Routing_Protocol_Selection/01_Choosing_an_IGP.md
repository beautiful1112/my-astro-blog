# Choosing an IGP

An IGP’s job is **underlay reachability inside a failure-domain budget**. BGP’s job is **policy and scale across domains**. Mixing the jobs is a common CCDE trap.

## Quick selection

| Protocol | Natural fit | Awkward fit |
|---|---|---|
| **OSPF** | Enterprise campus/DC, multi-vendor, area hierarchy | Huge WAN with poor summarization, very large LSDB |
| **IS-IS** | SP/core, MPLS/SR, dual-stack TLVs, fast-conv culture | Small IT shops with no IS-IS skill (constraint) |
| **EIGRP** | Cisco-heavy enterprise, hub-spoke with stub | Multi-vendor core, Internet-scale policy |
| **RIP** | Tiny leftover | Anything with a real RTO |
| **BGP** | Edges, DC fabric scale, multitenancy, Internet | Replacing a 20-router campus IGP “because cloud” |

Skill and installed base are **constraints**. A theoretically prettier IS-IS core that nobody can troubleshoot at 03:00 is a bad design if the constraint is a two-person NOC.

## What you are really choosing

| Axis | Ask |
|---|---|
| Topology | Hub-spoke, multi-area campus, leaf-spine, SP ring? |
| Scale | Prefix count, churn, SPF/LSDB budget |
| Hierarchy | Can you summarize? Do you need areas/levels? |
| Vendors | Multi-vendor must-work features |
| People | Who debugs this after a change window? |
| Role split | Is policy better left to BGP at a seam? |

```text
Underlay IGP: few prefixes, fast, boring
Seam / policy: BGP
Tenant / Internet: BGP
Do not dump BGP Internet table into OSPF
```

## Dual IGP

Two IGPs (migration, merger, PE-CE) need a **planned seam** (BGP or one-way redistribute with tags). Eternal mutual redistribution is not a strategy—see [Redistribution as a design smell](03_Redistribution_as_a_Design_Smell.md).

## Real-world — multi-vendor university campus

**Facts:** Mix of Cisco and Juniper; dual DC; students + research; NOC is OSPF-fluent.

| R / C / A | Statement |
|---|---|
| R | Building uplink loss recovers without STP dependency |
| C | No IS-IS training budget this year |
| C | Address plan can summarize per building |
| A | “EIGRP is simpler” — false under multi-vendor constraint |

**Choice:** OSPF multi-area (buildings as areas, DC as area 0). Reject EIGRP as campus core. BGP only at Internet and research VRF seams.

## Real-world — regional ISP core

**Facts:** MPLS, SR rollout, dual-stack, 24×7 SP NOC already on IS-IS.

| Decision | OSPF | IS-IS |
|---|---|---|
| Dual-stack ops | OSPFv2+v3 or AF complexity | Natural TLV culture |
| SR/MPLS tooling | Possible | Team already lives here |
| Enterprise WAN PE-CE | Often OSPF/EIGRP toward CE | Keep IS-IS in core only |

```text
CE (OSPF/BGP) -- PE --(IS-IS + SR/MPLS)-- P -- PE -- CE
```

**Choice:** IS-IS underlay in core; BGP for services and Internet; do not force CE into IS-IS.

## Anti-patterns

| Anti-pattern | Why it fails |
|---|---|
| BGP everywhere in a small campus | Complexity without policy need |
| OSPF carrying full Internet | LSDB meltdown |
| IGP choice from a feature matrix alone | Ignores skill and topology |
| Two IGPs forever with casual redistribute | Loops and opaque paths |

## Design checklist

1. Is this underlay reachability or policy/scale? (IGP vs BGP)
2. Can the address plan support hierarchy for this protocol?
3. Does multi-vendor constrain the feature set?
4. Who owns 03:00 troubleshooting—and do they know this IGP?
5. Where will BGP sit so the IGP stays small?

## Risks

- Picking IS-IS “for scale” in a 40-router OSPF shop with no training.
- Using EIGRP as the multi-vendor core.
- Letting IGP and BGP both carry the same messy policy.
- Ignoring redistribution seams in mergers.

## Interview framing

“I pick an IGP for topology and who can operate it. I pick BGP when I need policy or domain isolation. I do not pick a protocol because it won a feature checklist.”

## Related

- [Hierarchy and summarization](02_Hierarchy_and_Summarization.md)
- [Redistribution as a design smell](03_Redistribution_as_a_Design_Smell.md)
- [OSPF area design](../07_OSPF_Design/01_OSPF_Area_Design.md)
- [IS-IS versus OSPF for design](../08_ISIS_Design/01_ISIS_vs_OSPF_for_Design.md)
- [EIGRP and BGP design](../09_EIGRP_and_BGP_Design/README.md)

---
