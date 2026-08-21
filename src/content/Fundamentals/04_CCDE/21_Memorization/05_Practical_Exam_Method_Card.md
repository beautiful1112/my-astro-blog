# Practical exam method card

## Minute-zero ritual

1. Skim entire module set for contradictions early.
2. Extract R/C/A with numbers.
3. Write Option A/B before drawing favorites.
4. Start a **consistency log** (IGP, L2 policy, hubs, cloud, PEPs).

## Loop per module

```text
Extract → Options → Decide → HLD → HA/Security → Migrate → Sync log
```

## Must-produce artifacts

| Artifact | Check |
|---|---|
| Numbered R/C/A | No tech-as-requirement |
| Two options | Real loser |
| Plane-aware HLD | Underlay/overlay clear |
| Failure story | Named blast radius |
| Migration | Phases + rollback |
| Residual risk | Honest |

## Time traps

| Trap | Counter |
|---|---|
| Pretty drawing first | 20 min extract lock |
| LLD timer soup | Stay HLD altitude |
| Module contradiction | Read log every switch |
| No migration | Force last 15% time |

## Oral defense pocket

“For R#, I chose X over Y because C#; I spend Z; residual risk is …; proof is …”

**Example:** “For clinical RTO (R1), L3 between buildings over campus VLAN (Y) because prior STP outage (history) and staff can learn OSPF (not C-blocked); spend more SVIs; residual biomedical temporary L2; prove with link-pull.”

## Elective reminder

Module 4 still must obey same R/C/A and not break core modules’ seams.

## Related

- [Practical time and traps](../18_Migration_and_Practical_Method/05_Practical_Time_and_Traps.md)
- [Compare and justify](../18_Migration_and_Practical_Method/04_Compare_and_Justify.md)
- [How to read a scenario](../18_Migration_and_Practical_Method/02_How_to_Read_a_Scenario.md)

## How to drill this card

1. Cover the right-hand examples; recite the rule.
2. Invent a one-line industry scene that forces the rule.
3. Write the discarded anti-pattern.
4. Link aloud to one Practical case in module 19.

## Expansion examples

| Rule | Scene |
|---|---|
| Bound the domain | Retail POS VLAN per store, not region |
| Dual path before timers | Second fiber before BFD 50 ms |
| BGP at seams | Internet communities, not OSPF defaults from ISP |
| RT = topology | Hub-spoke stores, no store-store |
| SoT + canary | Git push to 5 closets first |

## Anti-cram note

Memorization supports speed; it does not replace R/C/A extraction on a fresh scenario.

## How you prove it

- Explain one bullet with a topology sketch from memory
- Survive a “when not” question without notes
- Map the bullet to a business outcome in one sentence
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
