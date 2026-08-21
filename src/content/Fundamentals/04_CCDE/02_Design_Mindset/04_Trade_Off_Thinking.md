# Trade-off thinking

There is no globally best network. There is a **best fit** for a given set of requirements, constraints, and assumptions. CCDE answers are **comparisons with a loser**, not feature catalogs.

## Recurring axes

| Axis | Spend less / simpler | Spend more / harder | What you usually buy |
|---|---|---|---|
| Failure domain | Few large domains | Many small modules | Contained blast radius |
| Convergence | Default timers, no FRR | BFD, LFA/TI-LFA, dual path | Lower RTO |
| Scale | Flat, full mesh, full LSDB | Hierarchy, summary, RR, controllers | Prefix/session headroom |
| Cost | Single path, shared fate | Diverse CAPEX or cloud OPEX | Independence |
| Operations | One protocol, tribal knowledge | Automation + training | Change velocity |
| Security | Any-to-any, encrypt later | Segmentation + PEPs | Compliance, limited lateral movement |
| Time-to-change | Long freezes, hardware | Overlay + CI/CD | Fast app placement |

Improving one axis almost always taxes another. **State which axis you are spending** in every defense.

## Worked example — regional bank campus rebuild

**Brief:** 4 buildings, 3,000 users, one prior campus-wide STP outage, PCI card systems in building A, 2-person NOC, 9-month project, keep existing Catalyst access where possible.

**Option A — L3 to the access (or L3 distribution with tiny L2 closets)**

```text
Closet L2 only (1-2 switches)
   routed uplinks / ECMP
Building dist summarizes 10.10.x.0/20
   Area/process boundary toward core
Core: skinny, dual, few aggregates
PCI VRF from closet/dist to FW sandwich — not stretched VLAN
```

| Buy | Spend |
|---|---|
| Loop contained to closet | More IGP adjacencies; staff must read OSPF/EIGRP |
| Summarizable; PCI not in user flood domain | Longer Phase-1 (address + SVI moves) |

**Option B — L2 access, vPC distribution, FHRP**

| Buy | Spend |
|---|---|
| Familiar VLAN model; faster Phase-1 | Larger L2/vPC domain if VLANs stretch between floors/buildings |
| Fewer IGP edges | Next STP/vPC event can still be wide if trunks are lazy |

**Decision:** A for new work and building A (PCI). B only as a **temporary** pattern in one small building with **no VLAN stretch** and BPDU guard. Discard “one VLAN everywhere for simplicity” — that is what caused the outage.

## Worked example — 800-branch retail WAN

**Brief:** POS must survive HQ loss for 4 hours (SaaS POS), voice RTO 30 s preferred, budget hostile to dual MPLS, staff know DMVPN and are learning SD-WAN.

| Option | Fits? | Why |
|---|---|---|
| Single MPLS hub | No | HQ loss kills branches |
| Dual MPLS | Maybe | Cost; still need SaaS story |
| SD-WAN + DIA + LTE, dual regional hubs | Yes | Underlay diversity + DIA for POS; hub not SPOF |
| Full-mesh IPsec on one Internet | No | No second underlay; ops nightmare at 800 |

Spend **OPEX (LTE/DIA)** and **controller skill** to buy **site independence**. Do not spend a gold chassis at HQ and call it HA.

## False trade-offs

| Claim | Why it is false |
|---|---|
| “Redundancy vs cost” with no RTO | A second cheap LTE may beat a chassis UPS for site-loss RTO |
| “Security vs usability” with no PEP | NAC can be monitor → low-impact → enforce |
| “On-prem vs cloud” with no residency | Wrong region can be illegal even if latency is better |
| “OSPF is better than EIGRP” | Only under *this* skill and topology constraint |

## Defense template (reuse)

```text
Outcome: …
Choice: …
Rejected: … because it violates R# / C#
Axis spent: … (money / ops / blast radius / time)
How we know: … (probe, drill, metric)
```

## Risks

- Picking the “modern” option without naming the loser → preference, not design.
- Optimizing one site’s elegance while the company’s failure domain stays huge.
- Trading operator cognitive load for features they cannot troubleshoot at 03:00.

## Interview framing

“Every design spends blast radius, money, or operational complexity. I say what I am spending, what I am buying, and which numbered requirement killed the alternative.”

## Related

- [Requirements, constraints, assumptions](03_Requirements_Constraints_Assumptions.md)
- [How to defend a design](06_How_to_Defend_a_Design.md)
- [RPO, RTO, ROI, and cost](../03_Business_Strategy/03_RPO_RTO_ROI_and_Cost.md)

---
