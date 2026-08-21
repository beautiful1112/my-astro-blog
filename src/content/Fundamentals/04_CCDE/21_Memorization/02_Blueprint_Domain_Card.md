# Blueprint domain card

Use as a **coverage map**. For each domain: one decision, one failure, one “when not.”

## Business / governance

| Cue | Ask |
|---|---|
| RTO/RPO/ROI | What HA buy? |
| Risk/continuity | Tier T0–T3 |
| Sovereignty | Where may data live/traverse? |
| Sustainability | Power vs diversity conflict? |

**Example:** EU PII → in-country dual DC, not US DR replica.

## Architecture / planes

| Cue | Ask |
|---|---|
| Planes | Control/data/mgmt under failure |
| Overlay/underlay | What breaks when underlay dies? |
| Hierarchy | Where do we summarize? |

**Example:** VXLAN green while spine down → apps dead; say it.

## L2 / campus

Minimize L2; STP bounds loops not blast radius; vPC ≠ metro stretch.

**Example:** Hospital buildings routed; biomedical VLAN closet-only temporary.

## Routing / MPLS / WAN

IGP boring underlay; BGP policy; RT topology; SD-WAN needs underlay diversity; hub dual.

**Example:** 600 stores hub-spoke + DIA SaaS; not full mesh.

## DC / cloud

Leaf-spine east-west; L3 DCI; on-ramp by app class; AI fabric isolated.

**Example:** GPU pod bordered L3; no VLAN into enterprise core.

## Security / automation / migrate

PEP at trust breaks; SoT + canary; phased migration with rollback.

**Example:** POS fail-open cache if controller cloud dies 2 h.

## Drill

Pick a domain daily; speak 60 s using one real scenario.

## Related

- [Official topics](../23_References/01_Official_CCDE_Blueprint.md)
- [Learning objectives](../01_Study_Roadmap/02_Learning_Objectives.md)

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
