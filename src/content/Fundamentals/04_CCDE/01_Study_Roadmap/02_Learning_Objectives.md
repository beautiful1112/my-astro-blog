# CCDE learning objectives

These objectives define “done” for a serious CCDE path. Linked modules are the primary study homes.

## Mindset and business

You should be able to:

- explain CCDE as **expert network design**, not expert configuration ([What CCDE is](../02_Design_Mindset/01_What_CCDE_Is.md));
- separate HLD from LLD and know which exam cares about which ([HLD vs LLD](../02_Design_Mindset/05_HLD_vs_LLD.md));
- extract requirements, constraints, and assumptions from messy stakeholder text ([R/C/A](../02_Design_Mindset/03_Requirements_Constraints_Assumptions.md));
- map CAPEX/OPEX, RPO/RTO, risk, and sustainability into design choices (module 03);
- discuss AI/ML as a **traffic, data-location, and governance** problem, not a buzzword ([AI/ML](../03_Business_Strategy/06_AI_ML_as_Business_Driver.md)).

## Planes, topology, and protocols

You should be able to:

- draw end-to-end flow and say which plane owns each hop (module 04);
- choose centralized, distributed, or hybrid control and name the fate-share (module 04);
- bound L2 domains and justify L2 vs L3 access (module 05);
- pick OSPF vs IS-IS vs EIGRP vs BGP with topology and operational reasons (modules 06–09);
- design MPLS/EVPN/SR as **service constructs**, not as “labels are cool” (module 10);
- place multicast and QoS as application contracts (module 11);
- make addressing hierarchical so summarization is possible (module 12).

## Architectures and operations

You should be able to:

- design campus, WAN/SD-WAN, Internet edge, DC, and cloud connectivity as modules (modules 13–14);
- convert RTO into HA mechanisms without accidental fate sharing (module 15);
- place segmentation, NAC/zero trust, and enforcement points (module 16);
- design automation and telemetry so Day-2 matches Day-0 intent (module 17);
- write a migration that does not require a single big-bang ([migration](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)).

## Exam and interview bar

You should be able to:

- contrast Written (HLD + business in enterprise context) vs Practical (scenario + elective);
- discard an option that meets the tech goal but violates a stated constraint;
- defend one design in 60 seconds, then name the first thing you would monitor.

## Self-check format

For each objective, demand three artifacts:

1. A one-sentence definition accurate enough for an interview.
2. A sketch or R/C/A table for a real or invented scenario.
3. One failure mode and how the design contains it.

If you can only recite the sentence, the objective is not met.

## Interview framing

“My CCDE bar is: extract R/C/A, pick a modular design, name the failure domain and the policy point, and explain the migration—without hiding behind a favorite protocol.”

---
