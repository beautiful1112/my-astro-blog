# Practical time and traps

The Practical punishes **perfect diagrams that contradict** and **beautiful tech that ignores migration**. Time discipline is part of the design skill.

## Time boxing (example 8 h day)

| Block | Focus |
|---|---|
| 0:00–0:20 | Read + R/C/A extract |
| 0:20–1:00 | Options + decision |
| Mid modules | HLD depth, HA, security |
| Last 20% | Migration, inconsistencies, leftover assumptions |

Adjust to actual module weights; protect extraction and consistency checks.

```text
Extract → Decide → Draw → Defend → Migrate → Consistency pass
Never: Draw → Invent requirements
```

## High-frequency traps

| Trap | Symptom | Fix |
|---|---|---|
| Technology first | Feature pile | R/C/A first |
| Contradictions | Module 1 vs 3 conflict | Running decisions log |
| Shared fate HA | Stretched L2 as dual DC | Fate-share checklist |
| No loser | Single option | Force Option B |
| Migration fantasy | Big bang only | Phases + rollback |
| Ops ignored | Nobody can run it | Skill constraint |
| Over-LLD | Timer soup early | HLD altitude |

## Real-world analog — executive design workshop

**Brief:** 1-day architecture workshop for board; team spends 5 hours drawing EVPN; last hour discovers residency conflict.

| R / C / A | Statement |
|---|---|
| R | Board needs decision-ready HLD same day |
| C | Fixed 8 hours |
| A | “Pretty fabric drawing equals decision” — false |

**Method:** First hour lock R/C/A and discard one illegal option; drawing second. Same as Practical.

## Consistency log (keep live)

- Chosen IGP / BGP seams
- L2 policy (stretch or not)
- Hub/HA model
- Cloud region posture
- Security PEPs

## Risks

- Polishing visuals while migration blank.
- Silent assumption drift.
- Running out of time on elective module.

## Interview framing

“I time-box extraction and decisions first, keep a consistency log, and reserve time to kill contradictions and write migration.”

## Related

- [How to read a scenario](02_How_to_Read_a_Scenario.md)
- [Written versus Practical](../01_Study_Roadmap/03_Written_vs_Practical.md)
- [Implementation and migration plans](01_Implementation_and_Migration_Plans.md)

## Decision checklist

1. Which numbered requirement does this choice serve?
2. Which constraint forbids the popular alternative?
3. What failure domain did we shrink or accept?
4. What is the migration/rollback story?
5. How will ops prove it on a Tuesday night?
## Failure modes to narrate

| Fault | Bad design reaction | Good design reaction |
|---|---|---|
| Link/node loss | Timers only; no alternate | Diverse path + detect + repair |
| Control-plane churn | Flood detail everywhere | Summary/stub/level + bounded domain |
| Human change error | No canary / huge blast | Module seams + staged change |
| Dependency outage | Silent shared fate | Named fate-share + residual risk |
## What to discard

Discard slogan-driven picks (“modern,” “vendor preferred,” “more redundant”) that cannot cite R/C/A. Discard designs that cannot state what still works when one module fails.

## How you prove it

- Whiteboard the module borders and plane roles in <3 minutes
- Pull a link/node in a lab or maintenance window and compare to RTO
- Show the discarded option and the requirement that killed it

---
