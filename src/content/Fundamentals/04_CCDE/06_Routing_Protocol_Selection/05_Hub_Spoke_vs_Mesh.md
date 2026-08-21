# Hub-spoke versus mesh

Topology choice drives **cost, latency, resilience, and control-plane load**. Mesh is not “more HA” if hubs or circuits share fate; hub-spoke is not “weak” if designed with dual hubs and regionalization.

## Comparison

| Axis | Hub-spoke | Full / partial mesh |
|---|---|---|
| Circuit cost | Lower | Higher |
| Spoke-spoke latency | Via hub (unless shortcuts) | Direct |
| Control plane | Natural stubs/summaries | More adjacencies/paths |
| Hub loss | Critical unless dual/regional | Different failure shapes |
| Ops | Simpler policy at hub | Harder end-to-end policy |

```text
Hub-spoke:   Spoke--Hub--Spoke
Dual hub:    Spoke--HubA/HubB--Spoke
Partial mesh: Regions meshed; sites hubbed
Full mesh:   Everyone to everyone (rare at scale)
```

## When each fits

| Fit hub-spoke | Fit more mesh |
|---|---|
| Branches to central apps | East-west between regional DCs |
| Strong central security PEP | Collaborative sites needing low latency |
| Cost-constrained WAN | Dense metro campus buildings |

## Real-world — insurance field offices

**Brief:** 600 offices; most traffic to HQ SaaS and central DC; some regional claims centers need low-latency between pairs; budget hostile to full MPLS mesh.

| R / C / A | Statement |
|---|---|
| R | Office→SaaS OK via DIA; claims centers RTT <20 ms to each other |
| C | Dual hubs funded; not full mesh |
| A | “SD-WAN full mesh overlay fixes all” without underlay — incomplete |

**Decision:** Hub-spoke for offices; partial mesh or regional dual-homing for claims centers; DIA breakout for SaaS. Reject full mesh of 600.

## Overlay note

SD-WAN can **present** mesh policy on hub-spoke underlay. Design both layers: underlay topology still sets hard failure modes.

## Risks

- Single hub SPOF labeled “hub-spoke best practice.”
- Mesh with shared fiber duct = fake diversity.
- Ignoring spoke-spoke traffic growth until hubs melt.

## Interview framing

“I pick hub-spoke or mesh from traffic matrix and cost—dual hubs and regional partial mesh beat fake full mesh on shared fate.”

## Related

- [WAN topologies](../13_Campus_WAN_and_Edge/02_WAN_Topologies.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [Fast convergence design](04_Fast_Convergence_Design.md)

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
