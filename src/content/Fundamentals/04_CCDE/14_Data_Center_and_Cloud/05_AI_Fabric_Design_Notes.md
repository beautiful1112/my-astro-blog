# AI fabric design notes

AI/ML clusters stress networks with **elephant east-west flows, strict topology symmetry, and lossless or carefully managed congestion**—different from typical enterprise campus assumptions.

## What changes versus classic DC

| Classic enterprise DC | AI training fabric |
|---|---|
| North-south heavy | East-west dominant |
| Modest fan-in | Rail/rail-like or non-blocking leaf-spine |
| Best-effort OK | Job completion time sensitive |
| Modest telemetry | Need fabric-wide visibility |
| Single tenant IT | Often dedicated fabric / VRF |

```text
GPU nodes -- leaf -- spine -- leaf -- GPU nodes
Symmetric ECMP; careful hashing; avoid oversub surprises
Storage fabric may be separate
```

## Design themes

| Theme | Notes |
|---|---|
| Topology | Non-blocking or planned oversub; rail architectures where used |
| Transport | RoCE/IB/Ethernet choices drive PFC/ECN design |
| Isolation | Separate from enterprise blast radius |
| Growth | Modular pods; do not stretch L2 for “simplicity” |
| Ops | Job-aware metrics, not only link green |

## Real-world — retailer builds LLM fine-tuning pod

**Brief:** First 256-GPU pod in existing DC; team wants to VLAN-extend into enterprise core for “easy storage”; security nervous.

| R / C / A | Statement |
|---|---|
| R | Training jobs finish within SLA; enterprise campus unaffected by PFC storms |
| C | Shared building power/cooling; limited spine ports |
| A | “Just trunk AI VLAN to core” — false |

**Decision:** Dedicated leaf-spine pod with L3/EVPN border to enterprise; separate storage plan; strict QoS/PFC containment. Reject L2 stretch into campus.

## Border to enterprise

| Keep on AI fabric | Exit via border |
|---|---|
| GPU all-reduce | User access, MLOps tools |
| Storage backend (often) | Corporate AD/DNS carefully |

## Risks

- PFC pause storms leaking domain-wide.
- Oversubscription discovered only in production jobs.
- Shared fate with enterprise change windows.

## Interview framing

“AI fabrics are east-west performance domains: I isolate them, engineer congestion explicitly, and attach to enterprise only at controlled L3 borders.”

## Related

- [Leaf-spine versus three-tier](01_Leaf_Spine_vs_Three_Tier.md)
- [VXLAN EVPN DC](02_VXLAN_EVPN_DC.md)
- [Scale limits and modularity](../15_High_Availability_and_Scale/05_Scale_Limits_and_Modularity.md)

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
