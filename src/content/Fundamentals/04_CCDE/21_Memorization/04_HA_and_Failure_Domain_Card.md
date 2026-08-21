# HA and failure domain card

## Definitions

| Term | One-liner | Example |
|---|---|---|
| Failure domain | Shares fate for a fault class | One STP region |
| Blast radius | Reach of impact | Three buildings down |
| Fate sharing | Hidden correlator | Dual PE, one conduit |
| RTO | Time to recover | Voice 30 s |
| RPO | Data loss tolerance | Async DR 15 min |

## Order of HA buys

1. Remove shared fate (power, fiber, STP, RR, controller).
2. Add diverse path.
3. Faster detect (BFD).
4. Local repair (LFA/TI-LFA/ECMP).
5. Control restart (NSF/GR).
6. FHRP only for first-hop L2 story.

## Domain sizing habits

| Domain | Prefer |
|---|---|
| L2 | Closet / leaf pair |
| IGP | Area/level per site/region |
| VPN | RT policy matching who-talks |
| Cloud | Region/AZ explicit |

## Quick failure drills

| Kill | Ask |
|---|---|
| One core | What still forwards? |
| One hub | Spoke-spoke / SaaS? |
| Controller | Fail-open which classes? |
| AZ | Multi-AZ or multi-region need? |

**Example:** Dual firewalls on one VM host = fake HA.

## Anti-patterns

- More boxes in one L2 domain.
- Aggressive timers on flappy links.
- NSF claimed as fiber protection.
- Stretched VLAN as “dual DC HA.”

## Related

- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [FHRP NSF GR BFD](../15_High_Availability_and_Scale/03_FHRP_NSF_GR_BFD.md)

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
