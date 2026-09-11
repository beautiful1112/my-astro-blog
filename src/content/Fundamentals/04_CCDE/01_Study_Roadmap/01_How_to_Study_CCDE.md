# How to study CCDE

Study **decisions**, not commands. For every technology, be able to say when it belongs, when it does not, what it costs, and what fails first.

## Pass 1 — Mindset and business

Build the designer’s loop before protocol depth:

1. Separate requirement, constraint, and assumption ([R/C/A](../02_Design_Mindset/03_Requirements_Constraints_Assumptions.md)).
2. Practice trade-off language: scale, failure domain, opex, risk, time-to-change ([trade-offs](../02_Design_Mindset/04_Trade_Off_Thinking.md)).
3. Map RTO/RPO/ROI to HA and cost ([continuity](../03_Business_Strategy/03_RPO_RTO_ROI_and_Cost.md)).
4. Draw control / data / management planes on one page ([planes](../04_Planes_and_Traffic_Flow/01_Control_Data_Management_Planes.md)).

```text
Business outcome
    → R / C / A list
        → ≥2 technical options
            → pick one + name the loser
                → HA / security / ops / migrate story
```

## Pass 2 — Technology as design tools

Do not re-learn every protocol from zero. Use existing libraries, then ask design questions:

| Tool | Protocol home | Design question |
|---|---|---|
| EIGRP | [EIGRP library](../../03_EIGRP/EIGRP_Deep_Dive.md) | Query domain, stub/summary, hub-spoke |
| BGP | [BGP library](../../02_BGP/BGP_Deep_Dive.md) | Policy, RR scale, PE-CE, Internet edge |
| Multicast | [Multicast library](../../01_Multicast/Multicast_Deep_Dive.md) | ASM vs SSM, RP placement, domains |
| DC fabric | [DC library](../../05_DC/01_Study_Roadmap/01_How_to_Use_This_Guide.md) | Clos underlay, EVPN overlay, DCI, service insertion |
| OSPF / IS-IS / MPLS / QoS | this CCDE library | Area/level, VPN topology, marking trust |

For each: one topology sketch, one “when not to use,” one failure that the choice makes worse.

## Pass 3 — Scenario practice

1. Work [practical cases](../19_Practical_Cases/README.md) closed-book: extract R/C/A, pick two options, discard one with a reason.
2. Drill [Practical method](../18_Migration_and_Practical_Method/README.md) under time.
3. Answer [interview questions](../20_Interview_Questions/README.md) aloud in one sentence plus one counterexample.

## Weekly cadence (sample)

| Day | Focus | Output |
|---|---|---|
| Mon–Tue | One blueprint domain (e.g. WAN) | One-page HLD + trade-off table |
| Wed | Failure drill | Kill one link/node; rewrite HA story |
| Thu | Migration | Brownfield steps with rollback |
| Fri | Timed written-style set | 8–12 items; mark weak topics |
| Weekend | Practical case or oral defense | 60-second defense recorded |

## Invariant checklist

Whenever a vendor or overlay changes, preserve the invariant being designed:

| Invariant | Typical evidence |
|---|---|
| Business outcome | RTO/RPO, compliance, cost, time-to-market |
| Failure domain | What shares fate; blast radius |
| Control vs data | Who computes path vs who forwards packets |
| Policy point | Where intent is enforced |
| Operations | Who can change it on a Tuesday night |
| Migration | How you get there from brownfield |

## Real-world — mid-career engineer studying while shipping

**Brief:** Enterprise campus + SD-WAN rollout; 8 hours/week study; Written in 5 months.

| R / C / A | Statement |
|---|---|
| R | Pass Written with design-language answers, not CLI dumps |
| C | Only evenings/weekends; live project uses Cisco SD-WAN |
| A | “Reading RFCs alone equals design skill” — false |

**Method:** Map every work decision (underlay IGP, hub HA, cloud on-ramp) into R/C/A notes the same week. Reject pure lab CLI as primary study. Use this library’s cases for the defense muscle.

## Risks

- Studying like CCIE (features first) and failing Written on business/trade-off items.
- Collecting diagrams without naming losers.
- Skipping migration and ops until after technology choices harden.

## Interview framing

“I study CCDE by forcing every technology through requirements, constraints, and failure domains—then I keep the option I can defend when one of those three changes.”

## Related

- [Learning objectives](02_Learning_Objectives.md)
- [Written versus Practical](03_Written_vs_Practical.md)
- [What CCDE is](../02_Design_Mindset/01_What_CCDE_Is.md)

---
