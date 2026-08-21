# Interview: WAN, DC, and cloud

## Q1 — SD-WAN without underlay design?

**Model:** Overlay cannot invent diverse photons; design both.

## Q2 — DIA vs hub hairpin for SaaS?

**Model:** DIA/SSE for latency; hub when central inspect required—state the trade-off.

## Q3 — Cloud on-ramp choice?

**Model:** SaaS vs IaaS, residency, inspect needs, regional fail.

## Q4 — Leaf-spine vs three-tier?

**Model:** East-west scale and ECMP vs legacy north-south campus habits in DC.

## Q5 — L2 DCI?

**Model:** Usually avoid; prefer L3/EVPN; stretched L2 is shared fate.

## Q6 — EVPN value?

**Model:** Unified control for L2/L3 overlay; still needs underlay discipline.

## Q7 — Multihoming Internet?

**Model:** BGP policy, traffic engineering, failure domains—not just two links.

## Q8 — AI fabric vs enterprise DC?

**Model:** Isolate elephant east-west; congestion tools; L3 border only.

## Q9 — VPN hub-spoke RT intent?

**Model:** Spokes import hub only; prevent lateral spoke traffic.

## Q10 — When is partial mesh worth it?

**Model:** Stable high-value site pairs needing RTT; not full N².

## Q11 — Sovereignty vs multi-AZ cloud?

**Model:** Multi-AZ in-region often OK; cross-border replica may not be.

## Q12 — Branch dual transport roles?

**Model:** SLA vs best-effort; pin critical apps; measure brownout.

## Related

- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [Cloud on-ramp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)
- [DCI patterns](../14_Data_Center_and_Cloud/03_DCI_Patterns.md)

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
