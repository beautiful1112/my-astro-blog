# CIA triad in design

Confidentiality, Integrity, and Availability are **requirements language** for security-minded design. CCDE expects you to map each to concrete controls—not to recite the acronym.

## Mapping to network design

| Pillar | Network meaning | Example controls |
|---|---|---|
| Confidentiality | Limit who can see/data paths | Segmentation, encryption, least privilege |
| Integrity | Prevent unauthorized change/tamper | Signed routes, AAA, change control, anti-spoof |
| Availability | Keep service within RTO | Diversity, HA, DDoS posture, bounded domains |

```text
CIA is not a product feature checkbox
Each pillar can trade off against others
(e.g., strict controls vs availability during outage)
```

## Trade-offs you must name

| Tension | Example |
|---|---|
| C vs A | Fail-closed PCI vs fail-open guest Wi-Fi |
| I vs A | Strict change freezes vs emergency fix speed |
| C vs ops | Heavy encryption vs troubleshooting visibility |

## Real-world — municipal services network

**Brief:** 911 CAD requires availability; tax records require confidentiality; public Wi-Fi is best-effort; one shared campus core historically.

| R / C / A | Statement |
|---|---|
| R | CAD RTO 30 s; tax data not on public Wi-Fi path; integrity of routing to CAD |
| C | Budget for one physical refresh wave |
| A | “One flat secure VLAN meets CIA” — false |

**Decision:** Separate VRFs/PEPs for CAD vs tax vs public; dual path for CAD; encryption where required; public fail-open isolated. Reject shared L2 for all three pillars’ data.

## Design review prompts

1. What data class needs C most?
2. What process needs A most?
3. Where can integrity fail (route leak, config drift)?
4. What is acceptable degraded mode?

## Risks

- Availability theater without confidentiality seams.
- Encryption without key/ops plan.
- Ignoring integrity of control plane (route leaks).

## Interview framing

“I translate CIA into segmentation, control-plane integrity, and HA tiers—and I state which pillar wins when they conflict.”

## Related

- [Segmentation](02_Segmentation.md)
- [Policy enforcement points](04_Policy_Enforcement_Points.md)
- [Risk, reward, and continuity](../03_Business_Strategy/04_Risk_Reward_and_Continuity.md)

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
