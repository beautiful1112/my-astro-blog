# How to read a scenario

Practical and Written scenarios hide the exam in **narrative**. Your first job is extraction, not drawing.

## First pass (2–5 minutes)

1. Who is the business and what must not break?
2. Circle numbers: RTO, sites, users, budget, timelines.
3. Mark hard limits: vendors, skills, regulations, freeze windows.
4. Note political wants (“we love vendor X”) as constraints or assumptions—not automatic requirements.
5. List applications and traffic directions.

```text
Highlight → R / C / A columns → traffic matrix sketch → options
```

## Sorting language

| Phrase type | Bucket |
|---|---|
| “must / required / regulator” | Requirement |
| “cannot / only two engineers / budget” | Constraint |
| “probably / expected / preferred” | Assumption or soft want |
| “CEO saw a demo” | Constraint on politics—still need outcome |

## Real-world style brief (practice)

**Text:** Mid-size hospital, 3 buildings, Epic downtime costs $200k/hour, prior STP outage, PCI for gift shop, staff of 3, prefers Cisco, wants “cloud Wi-Fi,” 6-month window, keep biomedical VLANs temporarily.

| R / C / A | Statement |
|---|---|
| R | Clinical apps RTO tied to $ impact; PCI isolated |
| C | Staff 3; temporary biomedical L2; 6 months |
| A | “Cloud Wi-Fi removes wired design need” — challenge |

## Second pass

- Draw current vs target at module level.
- Identify fate-share in the story (often unstated).
- Write two options before falling in love with one.

## Risks

- Designing the demo they mentioned, not the RTO they need.
- Missing timelines (migration infeasibility).
- Ignoring soft constraints until defense fails.

## Interview framing

“I read scenarios by extracting R/C/A and numbers first—technology choices come after the constraints are visible.”

## Related

- [Extract requirements](03_Extract_Requirements.md)
- [R/C/A](../02_Design_Mindset/03_Requirements_Constraints_Assumptions.md)
- [Practical time and traps](05_Practical_Time_and_Traps.md)

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
## Micro-scenario (second pass)

**Brief:** Constraints tighten mid-project (budget cut, skill loss, or regulator letter).

| R / C / A | Statement |
|---|---|
| R | Preserve the original outcome metric |
| C | New hard limit appears |
| A | “Keep the old HLD unchanged” — usually false |

**Move:** Re-open only the decisions that the new constraint touches; keep invariants that still fit. Document what you demote from requirement to wish.

## One-page defense skeleton

```text
Outcome (R#)
Choice (one sentence)
Loser (one sentence)
Spend (cost/complexity/suboptimal)
Residual risk
Proof (test/KPI)
```

---
