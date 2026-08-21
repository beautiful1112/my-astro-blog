# Misconception: HLD is just a pretty drawing

## The myth

“High-level design means a colorful Visio with boxes and logos.”

## Why it is wrong

An HLD is a set of **invariants**: modules, seams, planes, failure domains, policy points, and migration posture. A drawing without that narrative is decoration. Graders and ARBs ask what breaks and why alternatives lost.

## Counterexamples

| Pretty artifact | Missing substance |
|---|---|
| Fabric wallpaper | No RTO mapping |
| Icon zoo | No discarded option |
| Full LLD ports on “HLD” | Wrong altitude; hides architecture |
| Copy-paste reference design | No constraint fit |

## Correct habit

Pair every diagram with: numbered R/C/A, buy/spend, fate-share statement, and residual risk. If removing logos leaves no decisions, it was not an HLD.

## Richer myth variants

- “LLD spreadsheet can replace HLD.”
- “One slide for executives needs no failure math.”
- “Green checkmarks equal requirements traceability.”

## Interview poke

“Point to the failure domain boundary on your drawing.” Silence means art, not design.

## Related

- [HLD versus LLD](../02_Design_Mindset/05_HLD_vs_LLD.md)
- [How to defend a design](../02_Design_Mindset/06_How_to_Defend_a_Design.md)
- [Design is not implementation](../02_Design_Mindset/02_Design_Is_Not_Implementation.md)

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
