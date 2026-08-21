# Misconception: best protocol wins

## The myth

“There is a globally best IGP/VPN/overlay—always pick it.”

## Why it is wrong

Protocols are tools. **Fit** depends on topology, scale, vendors, skills, and the failure budget. A theoretically elegant IS-IS/SR core that nobody can troubleshoot is a bad enterprise design under a two-person NOC constraint.

## Counterexamples

| “Best” claim | Fit reality |
|---|---|
| IS-IS always for MPLS | OSPF+LDP/SR can be valid |
| BGP everywhere | Tiny campus suffers complexity |
| EIGRP is obsolete | Still strong Cisco hub-spoke |
| EVPN always | Skill/platform may block |

## Correct habit

Select with a table: requirements, constraints (especially people), when-not, and migration cost. Name the loser protocol explicitly.

## Richer myth variants

- “Vendor reference architecture ends debate.”
- “Newest RFC must appear in HLD.”
- “Multi-protocol is automatically safer.”

## Interview poke

“When would you *not* use your favorite protocol?” No answer = preference, not design.

## Related

- [Choosing an IGP](../06_Routing_Protocol_Selection/01_Choosing_an_IGP.md)
- [Trade-off thinking](../02_Design_Mindset/04_Trade_Off_Thinking.md)
- [Technology selection card](../21_Memorization/03_Technology_Selection_Card.md)

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
