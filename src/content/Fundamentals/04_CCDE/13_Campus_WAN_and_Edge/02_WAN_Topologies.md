# WAN topologies

WAN topology is chosen from **traffic matrix, cost, resilience, and policy centralization**—then underlay and overlay must agree.

## Patterns

| Topology | Shape | Typical fit |
|---|---|---|
| Hub-spoke | Sites → hub(s) | Branches to central apps |
| Dual-hub | Sites → HubA/HubB | HA hub-spoke |
| Regional hub | Sites → region → national | Scale |
| Partial mesh | Extra site-site links | Latency pairs |
| Full mesh | Rare at large N | Tiny / special |
| Internet DIA hybrid | Local breakout + hub | SaaS-heavy |

```text
        HubA ---- HubB
       /  \        /  \
   Site   Site  Site  Site
Optional regional meshes on top
```

## Underlay vs overlay

| Layer | Decision |
|---|---|
| Underlay | Circuits, IGP/BGP, diversity |
| Overlay | SD-WAN/VPN topology & policy |

An overlay full mesh on single-homed underlay still fails when the fiber dies.

## Real-world — grocery chain

**Brief:** 1,200 stores; POS + SaaS inventory; two DCs; cold sites need dual path; cost caps full MPLS dual everywhere.

| R / C / A | Statement |
|---|---|
| R | POS survives single transport loss; SaaS prefers local DIA |
| C | Dual MPLS only at regional hubs; stores MPLS+Broadband |
| A | “Full mesh SD-WAN equals dual DC connectivity always” — false |

**Decision:** Dual-hub regional; store hub-spoke; DIA for SaaS; critical POS pinned with SLA transport. Reject store-to-store any-to-any as default.

## Selection table

| If traffic is… | Lean to… |
|---|---|
| Mostly to hub/SaaS | Hub-spoke + DIA |
| Many east-west partners | Partial mesh / regional |
| Extreme hub risk | Dual/multi hub + regionalization |

## Risks

- Single hub labeled highly available.
- Fake diversity (same duct).
- Topology drawings without bandwidth math.

## Interview framing

“I pick WAN topology from the traffic matrix and hub risk—dual hubs and regionalization beat paper full mesh on shared underlay.”

## Related

- [Hub-spoke versus mesh](../06_Routing_Protocol_Selection/05_Hub_Spoke_vs_Mesh.md)
- [SD-WAN design](03_SD_WAN_Design.md)
- [Cloud on-ramp](05_Cloud_OnRamp.md)

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
