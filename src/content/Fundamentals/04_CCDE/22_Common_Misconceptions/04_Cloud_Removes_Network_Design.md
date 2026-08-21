# Misconception: cloud removes network design

## The myth

“Move to cloud/SaaS and network architecture stops mattering.”

## Why it is wrong

Cloud shifts **where** seams live; it does not delete path, identity, sovereignty, HA, or egress control. Hairpins, on-ramps, DNS, and regional failures still decide user experience and compliance.

## Counterexamples

| Cloud move | Network still decides |
|---|---|
| SaaS adoption | DIA vs DC hairpin RTT |
| IaaS dual region | Routing, interconnect, DNS failovers |
| “Cloud Wi-Fi” | Wired underlay + segmentation remain |
| Lift-and-shift VM | Overlap IPs, hybrid paths, FW PEPs |

## Correct habit

Design on-ramp patterns per app class, pin regulated data, and measure experience to the real dependency—not only the WAN circuit to “the cloud.”

## Richer myth variants

- “Provider HA badge equals your RTO.”
- “One VPC peering mess replaces WAN hierarchy.”
- “Encryption to SaaS equals sovereignty.”

## Interview poke

“What breaks for users if region X or on-ramp Y dies?” If the answer is ‘cloud handles it,’ dig for evidence.

## Related

- [Cloud on-ramp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)
- [Cloud hybrid placement](../14_Data_Center_and_Cloud/04_Cloud_Hybrid_Placement.md)
- [Data sovereignty](../03_Business_Strategy/07_Data_Sovereignty_and_Governance.md)

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
