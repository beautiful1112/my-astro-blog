# Risk, reward, and continuity

Design is risk management with packets. Continuity requirements (RTO/RPO, critical processes) set how much reward you must buy with capital and complexity.

## Risk vocabulary for designers

| Term | Network meaning |
|---|---|
| Likelihood | How often a class of fault occurs |
| Impact | Blast radius × business criticality |
| Residual risk | What remains after controls |
| Shared fate | Hidden correlating factor |
| Continuity | Ability to keep critical process running |

```text
Risk ≈ Likelihood × Impact
HA spend should target high Impact first, then Likelihood
```

## Continuity tiers (example)

| Tier | Example process | Typical network ask |
|---|---|---|
| T0 | Safety / life-critical | Dual path, diverse sites, tested failover |
| T1 | Revenue now (POS, trading) | Aggressive RTO; no single hub |
| T2 | Important internal | Minutes–hours; warm spare |
| T3 | Best effort | Restore from procedure |

Do not spend T0 money on T3 flows without a business owner.

## Reward side

| Reward | Bought by |
|---|---|
| Uptime / RTO | Diversity, FRR, dual DC |
| Agility | Overlays, automation, cloud on-ramp |
| Compliance | Segmentation, logging, locality |
| Cost reduction | Consolidation—**watch fate-share** |

Consolidation can be a reward and a risk amplifier at once.

## Real-world — pharmacy chain continuity

**Brief:** Prescription dispensing must continue if HQ WAN dies; corporate email can wait 4 hours; budget for dual MPLS only at regional hubs.

| R / C / A | Statement |
|---|---|
| R | Store dispensing apps RTO 5 minutes without HQ |
| C | Dual circuits only at 12 hubs; stores single-homed + LTE backup |
| A | “Redundant HQ cores protect stores” — false for HQ-dependent apps |

**Decision:** Move dispensing to regional/cloud with local breakout; keep email centralized. Reject more HQ core chassis as the continuity fix for stores.

## Risk register snippet (design-owned)

| Risk | Control | Residual |
|---|---|---|
| Hub fiber cut | Dual PE + diverse path | Regional weather correlation |
| Control-plane meltdown | Summaries, stub, BFD storm limits | Human mis-config |
| Cloud region loss | Multi-region for T0/T1 | Cost / complexity |

## Risks

- Buying redundant gear that shares power, STP, or RR fate.
- Ignoring likelihood (daily brownouts) while chasing rare earthquakes only.
- No tested failover—paper continuity.

## Interview framing

“I map continuity tiers to blast radius and spend HA where impact is highest—then I record residual risk instead of claiming zero risk.”

## Related

- [RPO, RTO, ROI, and cost](03_RPO_RTO_ROI_and_Cost.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)

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

---
