# Requirements, constraints, assumptions

Every CCDE scenario is a pile of sentences. Your first job is to **sort them**. Wrong bucket → wrong design, even if the protocol facts are perfect.

## Definitions

| Term | Meaning | Test |
|---|---|---|
| **Requirement** | An outcome the design must deliver | Can I fail a acceptance test if this is false? |
| **Constraint** | A limit you are not free to remove | Would removing it need an executive / legal change? |
| **Assumption** | Something you treat as true but was not given | What experiment validates it cheaply? |

Requirements are **tested**. Constraints are **respected** (or escalated). Assumptions are **listed and risky**.

## Extraction method

1. Highlight outcome verbs: *must, cannot, survive, comply, reduce cost, launch by, merge by*.
2. Mark inherited technology, calendar, budget, skill, and regulation as **constraints**.
3. Anything you invent to make the design work is an **assumption**—write it where a stakeholder can see it.
4. Gaps become **questions** (or explicit risks if the exam/scenario will not answer).

```text
Stakeholder text
  -> R: what "done" means (testable)
  -> C: what you may not change
  -> A: what you are betting on
  -> ?: missing RTO, diversity, skill, residency
```

## Real-world brief (healthcare system)

> “We are moving Epic to a colo in 6 months. Clinics must stay up if HQ dies. Guest Wi-Fi is fine on Internet. Imaging is latency-sensitive to the colo. We keep our OSPF campus. Security wants 802.1X everywhere next quarter. Budget for one 10G to colo.”

| ID | Sort | Text |
|---|---|---|
| R1 | Req | Clinics usable if HQ site lost (need RTO number — missing) |
| R2 | Req | Imaging path latency acceptable to colo (need ms — missing) |
| R3 | Req | Guest stays off clinical path |
| C1 | Constr | OSPF campus remains this year |
| C2 | Constr | Single 10G to colo in budget (second path not funded yet) |
| C3 | Constr | 802.1X target date (aggressive vs R1) |
| A1 | Assum | Colo power/network meets clinical RTO (must verify SLA) |
| A2 | Assum | Imaging vendors support L3 / DNS failover (often false — check) |
| ? | Gap | Exact RTO; whether second colo/Internet breakout is allowed later |

**Design impact:** Do **not** stretch clinical VLANs to colo. Prefer L3 + app/DNS failover. Treat single 10G as **constraint** — honest RTO may be “hours if fiber cut” unless LTE/DIA funded. Phase 802.1X **after** colo cutover if both in same window would stack risk (availability vs identity).

## Common mis-sorts

| Said | Often really | Danger |
|---|---|---|
| “We prefer SD-WAN” | Preference / option | Treat as requirement → skip DMVPN/MPLS that might fit |
| “Must use OSPF” from a 2012 standard | Constraint unless change control allows migration | Blocks better seam for a merger |
| “Should be highly available” | Incomplete requirement | Inventing five-nines without cost |
| “Cloud first” | Strategy slogan | Ignoring residency and exit cost |

## Design move when options collide

When two options both “work,” discard the one that:

1. Violates a **constraint**, or
2. Depends on a **silent assumption**, or
3. Fails the **testable requirement** under the first realistic failure.

Prefer the option that still works if the assumption fails—or make the assumption cheap to validate next week (fiber path survey, vendor L3 support letter, IdP RTO drill).

## Risks

- Designing to preferences and calling them requirements.
- Hiding assumptions so nobody funds the second circuit.
- Asking for “more redundancy” without an RTO that would force diversity.

## Interview framing

“I sort the brief into requirements, constraints, and assumptions before I pick a protocol. If I cannot show that table, I am decorating, not designing.”

## Related

- [Business to technical mapping](../03_Business_Strategy/01_Business_to_Technical_Mapping.md)
- [How to defend a design](06_How_to_Defend_a_Design.md)
- [Extract requirements](../18_Migration_and_Practical_Method/03_Extract_Requirements.md)

---
