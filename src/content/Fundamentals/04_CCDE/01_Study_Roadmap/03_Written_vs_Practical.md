# Written versus Practical

CCDE has two exams that test the **same design skill** at different resolutions.

## Written (400-007) v3.1

- **Format:** about 2 hours, 90–110 multiple-choice / multiple-answer items.
- **Focus:** high-level design (HLD) and **business requirements** in enterprise architectures.
- **Technology scope:** Core Technology List (not the elective deep lists).
- **Closed book.** Dual-stack expectation (IPv4 and IPv6).

Typical item: given constraints (budget, RTO, compliance, existing IGP), which design best meets the outcome—and which one looks “technically nicer” but violates a constraint.

## Practical v3.1

- **Format:** about 8 hours, scenario-based, four modules.
- **Modules 1–3:** always **core enterprise** technologies and topologies.
- **Module 4:** your **elective** (AI Infrastructure, Large Scale Networks, On-Prem and Cloud Services, or Workforce Mobility).
- **Skill:** read a living scenario, track changing requirements, choose and justify, sometimes revise an earlier choice.

You are not configuring a rack. You are selecting and defending designs as the story evolves.

```text
Written:  many short HLD / business items
Practical: one long story
            Module 1-3  Core enterprise
            Module 4    Chosen elective
```

## How to study each

| | Written | Practical |
|---|---|---|
| Practice unit | One constraint + two options | Multi-page scenario + timeline |
| Failure mode | Picking the “cool” tech | Ignoring a late requirement change |
| Artifact | One-sentence justification | R/C/A table + discarded options |
| Time | Seconds per item | Minutes per decision, hours total |

## Elective choice

Pick the elective that matches **your job**, not the one that sounds prestigious. Practical module 4 is long; shallow tourism fails. Core still matters: a Large-Scale specialist who cannot design a campus failure domain will still lose modules 1–3.

## Interview framing

“Written tests whether I can pick the right HLD under business constraints. Practical tests whether I can keep doing that as a scenario changes—and in one domain I claim depth.”

---
