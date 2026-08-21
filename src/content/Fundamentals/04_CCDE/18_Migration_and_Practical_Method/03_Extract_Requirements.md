# Extract requirements

Extraction turns story prose into a **numbered R/C/A list** you can design against and defend with.

## Method

1. Write every candidate statement on paper.
2. Tag R, C, or A (or “want—discard/soft”).
3. Merge duplicates; split compounds (“fast and cheap”) into axes.
4. Number them (R1, C1, A1…).
5. Map each major design choice to the numbers that forced it.

```text
Raw note → tag → number → link to design decision
```

## Quality tests

| Test | Fail symptom |
|---|---|
| Outcome vs technology | “R: must use VXLAN” |
| Removable? | If freely removable, not a constraint |
| Bet? | If ungiven, it is an assumption |
| Measurable? | Vague “flexible” with no metric |

## Real-world — logistics RFP excerpt

**Text:** “Global visibility, regional warehouses must operate if HQ fails for 8 hours, GDPR for EU customers, existing Juniper in EU, Cisco in US, SD-WAN preferred, 14-month program.”

| ID | Tag | Statement |
|---|---|---|
| R1 | R | Warehouse ops survive HQ loss 8 h |
| R2 | R | EU customer data residency honored |
| C1 | C | Mixed Cisco/Juniper by region |
| C2 | C | 14-month timeline |
| A1 | A | “SD-WAN preferred” equals mandatory everywhere — challenge |

## Output artifact

Keep a one-page table in every HLD:

| ID | Statement | Design impact |
|---|---|---|
| R1 | … | Dual regional apps / local breakout |
| C1 | … | Protocol choice per region |

## Risks

- Losing numbers under rewrite.
- Promoting vendor preference silently to R.
- Never revisiting A when facts arrive.

## Interview framing

“I extract and number R/C/A so every design choice cites a constraint or outcome—not a preference.”

## Related

- [How to read a scenario](02_How_to_Read_a_Scenario.md)
- [R/C/A](../02_Design_Mindset/03_Requirements_Constraints_Assumptions.md)
- [Compare and justify](04_Compare_and_Justify.md)

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
