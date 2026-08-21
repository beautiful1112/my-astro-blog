# Interview: mindset and business

## Q1 — What is CCDE testing?

**Model:** Expert design: requirements to a defensible, operable architecture and migration—not expert CLI.

**Wrong:** “Harder CCIE” or “memorize all RFCs.”

## Q2 — Requirement vs constraint vs assumption?

**Model:** Outcome that must be true / limit you cannot freely remove / ungiven bet you must list.

**Wrong:** Treating “we like SD-WAN” as a requirement without the outcome.

## Q3 — HLD vs LLD?

**Model:** Modules, planes, HA story vs IDs, timers, platform maps. Written is HLD-heavy.

## Q4 — RTO 4 h vs 15 s?

**Model:** 4 h can be cold procedures; 15 s needs dual path + BFD/FRR and no shared fate.

## Q5 — How do you defend a design in 60 s?

**Model:** Outcome, choice, rejected alternative, accepted risk, how you will measure.

## Q6 — Give a trade-off you accepted recently

**Model:** Name buy vs spend (e.g., “bought containment with more IGP edges”).

**Wrong:** “No trade-offs; we did best practice.”

## Q7 — Waterfall or Agile for network programs?

**Model:** Freeze failure domains/seams; iterate templates/policy. Hybrid is normal.

## Q8 — How does ROI show up in design?

**Model:** Cost of downtime vs HA spend; avoid gold-plating T3 flows.

## Q9 — Sustainability vs HA conflict?

**Model:** Do not remove diversity on T0 to save power; efficiency on non-critical first.

## Q10 — Data sovereignty vs multi-region HA?

**Model:** Escalate conflict; pin regulated data; do not silently replicate abroad.

## Drill tip

Answer aloud in ≤45 seconds, then add one counterexample.

## Related

- [What CCDE is](../02_Design_Mindset/01_What_CCDE_Is.md)
- [R/C/A](../02_Design_Mindset/03_Requirements_Constraints_Assumptions.md)
- [Defend](../02_Design_Mindset/06_How_to_Defend_a_Design.md)

## More rapid-fire prompts

| Prompt | Good shape |
|---|---|
| “Show the loser” | One sentence why Option B dies |
| “Shared fate?” | Name power/fiber/control coupling |
| “Migration day-1” | Phase 0 brownfield coexistence |
| “Ops at 03:00” | Who debugs; what runbook |
| “Measure” | KPI or failure drill |

## Answer rubric

| Score | Meaning |
|---|---|
| Weak | Slogan / vendor name only |
| OK | Trade-off named |
| Strong | R/C/A cited + residual risk |

## Practice method

Record a 45-second answer, then a 15-second counterexample. If you cannot name a discarded design, the answer is incomplete for CCDE.

## Decision checklist

1. Did I cite a numbered requirement?
2. Did I name a constraint that limited options?
3. Did I state residual risk?
4. Did I avoid CLI trivia as the defense?
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
