# Interview: security and automation

## Q1 — VLAN equal security?

**Model:** No—need VRF/SG/FW PEPs for real isolation.

## Q2 — Zero Trust network angle?

**Model:** Continuous verification, least privilege paths, identity-aware PEPs—not “no perimeter” chaos.

## Q3 — Where to put PEPs?

**Model:** At trust changes: campus border, DC, cloud on-ramp, partner extranet.

## Q4 — CIA conflict example?

**Model:** Fail-closed PCI vs availability; say which wins per class.

## Q5 — Automation source of truth?

**Model:** One SoT (often Git/controller); devices are renderings.

## Q6 — Controller failure mode?

**Model:** Define fail-open/closed per traffic class; cache critical policy.

## Q7 — CI/CD for network safety?

**Model:** Validate, canary, rollback, RBAC on pipeline identities.

## Q8 — Observability vs monitoring?

**Model:** App/user truth and path SLOs—not only link up/down.

## Q9 — AI exfil control?

**Model:** Approved corridors, block shadow SaaS, isolate training data paths.

## Q10 — Regulatory logging?

**Model:** Log locality and integrity; path design must make evidence possible.

## Q11 — Segmentation vs encryption?

**Model:** Both; encryption ≠ free lateral movement.

## Q12 — Change risk in automated fabrics?

**Model:** Blast radius of bad intent push; need canaries and break-glass.

## Related

- [Segmentation](../16_Security_Design/02_Segmentation.md)
- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [CI/CD for network](../17_Automation_and_Observability/03_CI_CD_for_Network.md)

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
