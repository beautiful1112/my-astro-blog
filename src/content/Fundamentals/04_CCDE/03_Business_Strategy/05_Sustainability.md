# Sustainability in network design

Sustainability is a **design constraint and outcome**: energy, hardware lifespan, cooling, travel-to-site, and waste—not only a corporate slogan. CCDE expects you to treat it like cost and risk when the brief includes it.

## Levers that actually move energy and waste

| Lever | Design move | Watch-out |
|---|---|---|
| Consolidation | Fewer lightly loaded chassis | Bigger blast radius |
| Right-size | Avoid over-provisioned always-on | Headroom for peaks / failure |
| Efficient forwarding | Modern ASICs, optics choice | Refresh cost vs energy save |
| Cooling / placement | Hot/cold aisle, avoid zombie closets | Facilities dependency |
| Ops travel | Remote management, automation | Out-of-band must be solid |
| Longevity | Modular growth vs rip-replace | Vendor lock / skill |

```text
Green claim without failure-domain math  →  greenwashing risk
Green consolidation without diversity     →  continuity risk
```

## When sustainability conflicts with HA

| Goal | Tension | Resolve by |
|---|---|---|
| Fewer devices | Less redundancy | Tier traffic; sleep non-T0 paths carefully |
| Lower idle power | Slower failover gear | Keep T0 dual; efficiency on T2/T3 |
| Longer hardware life | Miss security/feature needs | Segment refresh waves |

Never “save power” by removing the only diverse path for T0.

## Real-world — university carbon target + campus refresh

**Brief:** University pledges 30% IT energy cut in 5 years; campus has 40 half-empty wiring closets; research needs low latency east-west in one building.

| R / C / A | Statement |
|---|---|
| R | Measurable kWh reduction without harming research SLOs |
| C | Cannot fund full fabric everywhere this FY |
| A | “Collapse to two huge cores” is automatically green and safe — false |

**Decision:** Decommission zombie closets into fewer powered rooms **per building** with L3 boundaries; keep dual building uplinks. Reject single campus-wide collapsed core that creates one STP/power domain.

## Metrics to attach to HLD

| Metric | Why |
|---|---|
| Ports powered vs used | Zombie capacity |
| Devices per user/serving | Consolidation progress |
| Failover test pass rate | Prove green ≠ fragile |
| Refresh wave CO₂e estimate | Program tracking |

## Risks

- Using sustainability to justify unsafe SPOFs.
- Ignoring embodied carbon of premature rip-and-replace.
- No measurement—claims only.

## Interview framing

“I treat sustainability as a constraint: reduce waste and power while preserving failure domains for critical tiers—and I measure both kWh and failover tests.”

## Related

- [Risk, reward, and continuity](04_Risk_Reward_and_Continuity.md)
- [Scale limits and modularity](../15_High_Availability_and_Scale/05_Scale_Limits_and_Modularity.md)
- [Business to technical mapping](01_Business_to_Technical_Mapping.md)

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
