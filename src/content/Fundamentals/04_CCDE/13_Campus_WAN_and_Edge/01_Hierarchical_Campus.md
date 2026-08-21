# Hierarchical campus

Access / distribution / core exists to **modularize** failure and change. Collapse tiers when the site is small; do not collapse when you still need the module. Software-defined campus (SDA/EVPN) still has these **roles**, even if boxes are named fabric edge / border / control.

```text
Access        policy, PoE, trust boundary, endpoint scale
     |
Distribution  L2/L3 boundary, summary, FHRP or L3 access
     |
Core          fast, simple, few prefixes, high fan-in
```

Cloud-managed campuses change the **management plane**, not the need for a failure-domain story.

## Roles (not chassis count)

| Role | Job | Anti-pattern |
|---|---|---|
| Access | Attach users/IoT; enforce access policy | Stretching VLANs “because Wi-Fi” |
| Distribution | Aggregate; summarize; terminate L2 | Becoming a second core with full tables |
| Core | Reliable transport between modules | Hosting user VLANs and firewalls “temporarily” |

L2 vs L3 access is a separate decision: L3 access shrinks broadcast domains; L2 access needs careful STP/MSTP and FHRP or MLAG design.

## Three-tier vs collapsed

| Pattern | Fits | Watch |
|---|---|---|
| Collapsed core/dist | Small building, few wiring closets | Stack/pair fate-share |
| Classic three-tier | Multi-building campus | Do not overbuild core with policy |
| Modular (building blocks) | Large campus / multi-site | Consistent module template |
| Fabric (SDA/EVPN) | Scale + segmentation | Borders and underlay still hierarchical |

A multi-building campus that collapses everything into two stacked cores is often a **fate-share**, not a simplification.

## Decision table

| Signal | Prefer |
|---|---|
| One building, < ~10 closets | Collapsed OK |
| Many buildings, diverse power | Modular three-tier / fabric modules |
| Strong segmentation / VN | Fabric with clear edge/border roles |
| Ops wants “two big switches” | Challenge blast radius and change windows |

## Real-world — university multi-building campus

**Facts:** 40 buildings, dual DC, wireless everywhere, research VLANs historically sprawled.

**Design:**

- Per-building access + distribution module; L3 to campus core
- Core is dual, simple, OSPF/IS-IS with summaries per building block
- Wireless terminates with policy at edge/controller—not one giant L2
- Firewall/services at borders, not on every distribution pair
- Migration: reclaim stretched VLANs building-by-building

**Discarded:** Campus-wide VLAN for “mobility”—STP and broadcast storms already proved the cost.

## Real-world — 3-floor HQ (collapse)

**Facts:** Single site, two core/dist switches, PoE access, no DC on-site.

**Design:** Collapsed core/distribution VSS/stack/MLAG pair; L2 or L3 access as staffing allows; Internet edge separate. Document that growth to a second building triggers modularization.

## Design checklist

1. What is the module (closet, building, fabric edge set)?
2. Where is the L2/L3 boundary—and is it intentional?
3. What summarizes toward the core?
4. Where do wireless, NAC, and trust boundaries sit?
5. Under failure, how many users share fate with one distribution pair?

## Risks

- Collapsing a large campus into one HA pair and calling it “simple.”
- Policy and firewalls stuffed into the core.
- Fabric marketing without underlay MTU, RR, and border design.
- Keeping STP scale while claiming L3 campus benefits.

## Interview framing

“Campus hierarchy is modules: access policy, distribution summary, skinny core. I collapse only when the site is small enough that the blast radius stays acceptable—and fabric products still inherit those roles.”

## Related

- [WAN topologies](02_WAN_Topologies.md)
- [SD-WAN design](03_SD_WAN_Design.md)
- [L2 versus L3 access](../05_Layer2_Design/04_L2_vs_L3_Access.md)
- [L2 failure domains](../05_Layer2_Design/01_L2_Failure_Domains.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)

---
