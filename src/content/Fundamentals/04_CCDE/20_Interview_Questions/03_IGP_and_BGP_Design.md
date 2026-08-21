# Interview: IGP and BGP design

## Q1 — How do you choose an IGP?

**Model:** Topology, scale, vendors, skills, hierarchy need—not fashion.

## Q2 — When is EIGRP still right?

**Model:** Cisco-heavy hub-spoke with stub/summary discipline.

## Q3 — OSPF stub vs NSSA?

**Model:** Stub hides externals; NSSA when edge must inject externals.

## Q4 — Why summarize?

**Model:** Bound LSDB/churn; accept suboptimal path; use discard/conditionals.

## Q5 — IS-IS L1/L2 placement?

**Model:** L1/L2 at borders; contiguous L2; avoid everyone L1/L2.

## Q6 — When must enterprise use BGP?

**Model:** Policy, scale, Internet, multitenancy, seams—not to replace a tiny campus IGP casually.

## Q7 — RR design risk?

**Model:** RR cluster fate-share; hierarchy/placement; attribute reflection needs.

## Q8 — Redistribution smell?

**Model:** Mutual redistribute without tags/seams; prefer BGP seam.

## Q9 — Hub-spoke vs mesh WAN?

**Model:** Traffic matrix + cost; dual hubs; partial mesh for latency pairs.

## Q10 — Fast convergence recipe?

**Model:** Diversity → detection (BFD) → local repair → then timer tuning.

## Q11 — EIGRP query bound?

**Model:** Stub + summary; otherwise query storms.

## Q12 — MPLS underlay IGP job?

**Model:** Few prefixes, fast, boring; VPN policy stays in BGP.

## Related

- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [When enterprise needs BGP](../09_EIGRP_and_BGP_Design/03_When_Enterprise_Needs_BGP.md)
- [Redistribution smell](../06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)

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
