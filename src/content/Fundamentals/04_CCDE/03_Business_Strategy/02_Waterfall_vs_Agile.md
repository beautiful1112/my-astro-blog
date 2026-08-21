# Waterfall versus Agile (in network design)

Network programs rarely fit pure software Agile or pure waterfall. CCDE cares about **which decisions must be stable** versus **which can iterate**.

## What each model optimizes

| Model | Optimizes | Weakness in networking |
|---|---|---|
| Waterfall | Up-front certainty, auditability | Slow feedback; late discovery of underlay reality |
| Agile / iterative | Fast learning, partial delivery | Risk of thrashing HLD invariants weekly |
| Hybrid (common) | Stable architecture spine + iterative edges | Needs clear “what is frozen” |

```text
Freeze early:  failure domains, addressing hierarchy, seams, compliance paths
Iterate often: templates, dashboards, overlay policy packs, access configs
```

## Decision classes

| Decision class | Cadence | Example |
|---|---|---|
| Architectural invariant | Waterfall-like lock | No DC L2 stretch; OSPF area plan |
| Service feature | Agile backlog | New DIA breakout rule |
| Platform SKU | Wave-based | Access switch refresh pods |
| Observability | Continuous | SLOs, synthetic tests |

## Real-world — bank SD-WAN + segmentation program

**Brief:** Regulators want a documented target architecture; product teams want biweekly firewall rule velocity.

| R / C / A | Statement |
|---|---|
| R | Audit-ready HLD for payment zones; branch apps improve within 6 months |
| C | Change boards for underlay; app teams expect Agile tickets |
| A | “Agile means no architecture document” — false |

**Decision:** Waterfall-lock VRF model, hub HA, and logging PEP. Agile the overlay app-policy packs behind that spine. Reject “no HLD, only sprints.”

## Mapping to CCDE artifacts

| Artifact | Waterfall lean | Agile lean |
|---|---|---|
| R/C/A pack | Full up front | Revisit each epic |
| HLD | Versioned, change-controlled | Invariants frozen; edges evolve |
| Migration | Phased program plan | MVP then waves |
| Defense | Against full brief | Against current sprint goals + invariants |

## Risks

- Agile overlay on a broken underlay SPOF.
- Waterfall LLD detail before validating failure domains.
- Re-opening summarization and area design every sprint.

## Interview framing

“I freeze failure domains and seams like waterfall, and I iterate policy and templates like Agile—without letting sprints rewrite architecture invariants.”

## Related

- [Business to technical mapping](01_Business_to_Technical_Mapping.md)
- [HLD versus LLD](../02_Design_Mindset/05_HLD_vs_LLD.md)
- [Implementation and migration plans](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)

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
