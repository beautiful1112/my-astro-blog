# Business to technical mapping

The network is a **cost and risk instrument** for a business outcome. CCDE starts at the outcome and walks down; it does not start at a protocol and walk up hoping the business fits.

## Why this is a design skill

A “good” OSPF area map that does not support the merger date, the PCI scope, or the dual-DC RTO is a failed design—even if every adjacency is perfect. Mapping turns vague executive language into **testable requirements**, then into options you can kill with constraints.

```text
Business sentence
    --> testable requirement (what must be true under failure X)
    --> technical options
    --> kill by constraint (time, skill, plant, regulation, money)
    --> chosen option + residual risk + ops model
```

## Mapping table

| Business language | Technical translation |
|---|---|
| Enter a new region in 90 days | Overlay-friendly WAN, address plan, identity, not a new core IGP |
| Reduce branch opex | SD-WAN + zero-touch + fewer truck rolls |
| Survive DC loss | Dual DC, independent control, tested RTO—not “two chassis in one room” |
| Pass PCI / HIPAA / GDPR | Segmentation, logging, residency, who can decrypt |
| Merge two companies | Overlapping addresses, dual IGPs, policy at the seam |
| Launch AI training | East-west bandwidth, lossless fabric, data gravity, not “bigger Internet pipe” |
| Open 200 pop-up stores | Template + DIA + LTE backup; not private MPLS to every mall |
| Divest a business unit | Clean VRF/firewall cut, DNS, identity—before day-one legal separation |

## Method (four steps)

1. **Restate** the business sentence as a testable requirement (“customers check out if DC-A is down”).
2. **List** technical options that could satisfy it.
3. **Kill** options that violate constraints (calendar, skill, regulation, existing plant).
4. **Keep** the option whose **operational model** the company can actually run.

```text
"We need digital transformation"
   is not a requirement

"Customers must check out if DC-A is down,
 card data never leaves region EU"
   is a requirement
```

## R/C/A framing for mapping

| Letter | Meaning in this context |
|---|---|
| **R** | Requirement — measurable outcome under named conditions |
| **C** | Constraint — time, money, skill, regulation, brownfield plant |
| **A** | Assumption — unverified claim you must validate or turn into R/C |

If something stays an assumption (“circuits are diverse”), write it down and verify before you defend the design.

## Real-world — regional bank acquiring a fintech

**Business:** Close acquisition in 120 days; customers of both brands keep banking apps up; card data stays in regulated scope.

| R / C / A | Statement |
|---|---|
| R | Inter-company app APIs reachable with <50 ms added latency for named flows |
| R | PCI cardholder data stays in Bank VRF; fintech PII segmented |
| C | Cannot renumber either RFC1918 space before day 1 |
| C | Bank NOC knows OSPF; fintech is cloud + BGP only |
| A | “Same metro” means diverse fiber (must verify conduit maps) |

```text
Bank campus/DC (OSPF) ---- BGP seam / FW ---- Fintech cloud VRFs
         |                      |                    |
    Card data VRF          policy + NAT         app API VRF
```

**Chosen path:** BGP + firewall seam, dual NAT for overlapping `10/8`, no forced single IGP. Residual risk: two ops models until year-2 consolidation.

## Real-world — retail chain “must be cloud-first”

**Wanted:** All stores on public cloud firewalls and “no more MPLS.”

**Rewrite:** Stores need checkout if the cloud path is sick; inventory sync can wait hours.

| Decision | Option A (all cloud FW) | Option B (local breakout + cloud mgmt) |
|---|---|---|
| Checkout if cloud path down | Fails | Survives on local DIA + cached POS |
| Opex | Variable, central | Still need edge boxes |
| Skill | Security team owns | Store + security split |
| Fits 90-day rollout? | Risky truck rolls | Template + ZTP fits |

**Outcome:** Local Internet breakout for POS; cloud for analytics. “Cloud-first” became a **policy and analytics** story, not a single forwarding path.

## Mergers, acquisitions, divestitures

These are first-class CCDE problems: overlapping RFC1918, conflicting security policy, different IGPs, and a date. Design the **seam** (BGP, firewall, identity) before you dream of a single IGP. Divestiture is the reverse: prove you can cut without shared fate on DNS, certs, and management planes.

## Design checklist

1. Can I quote the business sentence as a pass/fail test?
2. Which constraints kill which pretty options?
3. What residual risk does the business accept in writing?
4. Who operates this at 03:00 on day 90?

## Risks

- Treating slogans (“transform,” “cloud-first”) as requirements.
- Choosing technology the NOC cannot run under the calendar.
- Ignoring identity and DNS as part of the “network” outcome.
- Optimizing for a protocol while missing the merger/divestiture date.

## Interview framing

“I translate business sentences into testable network requirements, then I pick technology that operations can run on the given calendar—not a reference architecture with the logo swapped.”

## Related

- [RPO, RTO, ROI, and cost](03_RPO_RTO_ROI_and_Cost.md)
- [Risk, reward, and continuity](04_Risk_Reward_and_Continuity.md)
- [How to defend a design](../02_Design_Mindset/06_How_to_Defend_a_Design.md)
- [Trade-off thinking](../02_Design_Mindset/04_Trade_Off_Thinking.md)

---
