# Interview: planes and control

## Q1 — Control vs data vs management?

**Model:** Compute reachability / forward packets / operate devices (config, telemetry, AAA).

## Q2 — Why separate management plane?

**Model:** OOB or protected path so you can fix the network when in-band data is sick.

## Q3 — Overlay vs underlay failure?

**Model:** Underlay loss breaks all overlays on it; overlay policy bugs can break apps while underlay is green.

## Q4 — Centralized vs distributed control?

**Model:** Controllers for consistency; distributed for survival; state fail-open/closed explicitly.

## Q5 — Policy plane example?

**Model:** SD-WAN app policy or SGT intent compiled to devices; define last-known-good.

## Q6 — Packet walk for user → SaaS

**Model:** Access → underlay → overlay/DIA → SSE/FW → SaaS; include return path.

## Q7 — Fate sharing across planes?

**Model:** Same RR, same fiber, same controller cluster for control+management.

## Q8 — When is in-band management acceptable?

**Model:** With QoS/ACL protection and a break-glass OOB story for hard failures.

## Q9 — Orchestration SPOF?

**Model:** Cache critical policy on edge; POS fail-open vs guest fail-closed as designed.

## Q10 — How do you draw planes on a whiteboard?

**Model:** One topology; annotate what each box does in control/data/management under failure.

## Drill tip

Force yourself to say what still works if the controller dies.

## Related

- [Planes](../04_Planes_and_Traffic_Flow/01_Control_Data_Management_Planes.md)
- [End-to-end flow](../04_Planes_and_Traffic_Flow/02_End_to_End_IP_Traffic_Flow.md)
- [Policy and orchestration](../04_Planes_and_Traffic_Flow/05_Policy_and_Orchestration_Planes.md)

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
