# Misconception: more redundancy is always better

## The myth

“Add another box, another link, another protocol—more HA.”

## Why it is wrong

Redundancy that **shares fate** or **adds control-plane complexity** can lower availability (loops, split brain, human error). Cost spent on a useless third path is not spent on the path that was actually shared.

## Counterexamples

| “Redundant” design | Real outcome |
|---|---|
| Two cores, one STP domain | Larger outage |
| Dual PE, one conduit | Both die together |
| Triple RR on one VLAN | Control-plane fate-share |
| Extra FHRP group on huge VLAN | Faster illusion, same blast radius |

## Correct habit

Name the domain you are splitting. If you cannot, you added parts, not HA. Prefer diversity of power, fiber, and failure domains over device count.

## Richer myth variants

- “Active-active everything” without split-brain plan.
- “More protocols for resilience” (OSPF+EIGRP mutual redis) creating loops.
- “Cluster the firewalls on one hypervisor host.”

## Interview poke

“Show me what fails together.” If the answer is silence, redundancy is unverified.

## Related

- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)
- [Risk, reward, and continuity](../03_Business_Strategy/04_Risk_Reward_and_Continuity.md)

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
