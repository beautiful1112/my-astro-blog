# CCDE core facts

Dense card—drill aloud, then add one example per bullet.

## Exam shape

- Written 400-007 v3.1: ~2 h, ~90–110 items, HLD + business, closed book, dual stack.
- Practical: ~8 h; modules 1–3 core enterprise; module 4 elective (AI Infra, Large Scale, On-Prem/Cloud, Workforce Mobility).
- Both: defend trade-offs; CLI is not the center.

## Designer loop

R/C/A → ≥2 options → trade-off (buy/spend) → defend → migrate → measure.

**Example:** RTO 30 s voice → dual L3 + BFD vs stretched VLAN → pick L3 → spend training → quarterly link pull.

## Planes

Control / data / management (+ policy / orchestration when present).

**Example:** SD-WAN: policy on controller; data in tunnels; management via TLS/API; underlay IGP still control for TLOCs.

## Defaults that save you

| Default | Example spend if violated |
|---|---|
| Minimize L2 | Campus STP meltdown |
| L3 DCI | Stretched VLAN dual-DC outage |
| No Internet table in IGP | Campus meltdown |
| Dual-stack parity | Broken v6 via Happy Eyeballs |
| Name fate-share | Dual router, one fiber duct |

## Protocol one-liners

| Tech | Card line | Tiny example |
|---|---|---|
| EIGRP | Stub + summary = query bound | Store spokes stub to hub |
| OSPF | Area 0 contiguous; stub/NSSA hide; summarize + discard | Buildings as areas |
| IS-IS | L2 contiguous; L1/L2 at edges | City L1, national L2 |
| BGP | Policy + seams; RR for iBGP scale | Internet edge communities |
| MPLS | P hides tenants; RT = VPN topology | Hub-spoke RT for PCI stores |
| QoS | Trust + end-to-end PHB | Untrust guest DSCP |
| Multicast | Prefer SSM; else anycast-RP | Stadium ASM → dual RP |

## HA stack order

Diversity → detection (BFD) → local repair → reconverge → NSF/GR for restarts → FHRP for first hop only.

## Related

- [Blueprint domain card](02_Blueprint_Domain_Card.md)
- [Technology selection card](03_Technology_Selection_Card.md)

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
