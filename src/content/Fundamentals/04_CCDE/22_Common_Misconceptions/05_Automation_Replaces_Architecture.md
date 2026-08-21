# Misconception: automation replaces architecture

## The myth

“With a controller/CI pipeline we no longer need careful design—the tool will enforce good networks.”

## Why it is wrong

Automation **amplifies** the architecture you encode. It can push a bad VLAN stretch or a fatal ACL to a thousand sites in minutes. Controllers need fail-open/closed design, source of truth, and bounded blast radius—the same CCDE concerns with faster consequences.

## Counterexamples

| Automation claim | Reality |
|---|---|
| Controller templates | Still encode hub SPOF if designed that way |
| CI/CD | Ships mistakes faster without canaries |
| Intent policy | Needs last-known-good when cloud controller dies |
| AIOps | Cannot invent diverse fiber |

## Correct habit

Architect first: modules, seams, failure domains. Then automate rendering and validation. Define break-glass and canary explicitly in the HLD.

## Richer myth variants

- “Inventory will emerge from the network.” (No—SoT first.)
- “No-docs culture because Git is the design.” (Git without invariants is still chaos.)
- “One pipeline user equals least privilege.” (Automate identities need RBAC too.)

## Interview poke

“What does a bad push do, and how do we stop the blast?” If unknown, automation is unfinished design.

## Related

- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [CI/CD for network](../17_Automation_and_Observability/03_CI_CD_for_Network.md)
- [APIs and model-driven](../17_Automation_and_Observability/02_APIs_and_Model_Driven.md)

## Exam tell

If an option promises “more,” “newer,” or “automatic” without naming a constraint or failure domain, treat it as this myth’s cousin.

## Repair language

| Instead of… | Say… |
|---|---|
| Always | Under these R/C/A |
| Best practice | Fit for this blast radius |
| Highly available | Diverse paths for class X, RTO Y |
| Secure | PEP at Z, segment A from B |

## Mini scenario drill

Take a design that looks “extra redundant.” List three shared-fate or complexity risks. Rewrite the HA story by splitting a domain instead of adding a box.

## Decision checklist

1. What domain did we actually split?
2. What new failure mode did we introduce?
3. What requirement forced the spend?
4. What residual risk remains?
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
