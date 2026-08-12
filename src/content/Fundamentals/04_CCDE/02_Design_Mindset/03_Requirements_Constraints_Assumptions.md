# Requirements, constraints, assumptions

Every CCDE scenario is a pile of sentences. Your first job is to **sort them**. Wrong bucket → wrong design.

## Definitions

| Term | Meaning | Example |
|---|---|---|
| **Requirement** | An outcome the design must deliver | Sites stay up if the primary DC dies; PCI traffic isolated |
| **Constraint** | A limit you are not free to remove | Existing OSPF, 12-month budget, no new dark fiber, GDPR residency |
| **Assumption** | Something you treat as true but was not given | WAN jitter stays < 20 ms; staff can run BGP |

Requirements are **tested**. Constraints are **respected** (or escalated). Assumptions are **listed and risky**.

## How to extract

1. Highlight verbs of outcome: *must, cannot, survive, comply, reduce cost, launch by*.
2. Mark inherited technology and time/money as constraints.
3. Anything you invent to make the design work is an assumption—write it where the examiner/stakeholder can see it.

```text
Stakeholder text
  -> R: what "done" means
  -> C: what you may not change
  -> A: what you are betting on
  -> gaps: questions to ask (or flag)
```

## Common mis-sorts

- “We prefer SD-WAN” stated as a requirement → often a **preference**; check if the outcome is “simplify branch ops” (requirement) with SD-WAN as one option.
- “Must use OSPF” from an old standard → **constraint** unless the scenario allows a migration.
- “Should be highly available” with no RTO → incomplete requirement; do not invent five-nines without saying you assumed it.

## Design move

When two options both “work,” the one that **violates a constraint** is wrong even if it is more elegant. The one that **depends on a silent assumption** is fragile. Prefer the option that still works if the assumption fails—or make the assumption cheap to validate.

## Interview framing

“I sort the brief into requirements, constraints, and assumptions before I pick a protocol. If I cannot show that table, I am decorating, not designing.”

---
