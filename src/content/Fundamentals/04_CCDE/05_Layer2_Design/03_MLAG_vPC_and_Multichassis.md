# MLAG, vPC, and multichassis

Multichassis LAG (vPC, MLAG, CLAG, etc.) makes two switches look like one LAG neighbor. It improves **link efficiency and dual-homing**; it does **not** erase L2 failure domains.

## What it solves

| Problem | Multichassis role |
|---|---|
| STP blocking one uplink | Both uplinks active |
| Single ToR/dist chassis dependency | Dual attach servers/switches |
| Blackhole on one peer link | Peer-link + orphan handling matters |

```text
        Server / Access
         |         |
       Po/LAG   Po/LAG
         |         |
      +--+--+   +--+--+
      | SW A |===| SW B |   peer-link + keepalive
      +------+   +------+
```

## What it does not solve

- Campus-wide VLAN stretch safety.
- Control-plane storms inside the extended L2.
- Split-brain if peer-link and keepalive design is weak.
- “Active-active” fantasies across DCs over distance.

## Design rules

| Rule | Why |
|---|---|
| Keep VLAN scope small | vPC multiplies bandwidth, not wisdom |
| Peer-link is critical | Treat as fate-share component |
| Orphan ports | Explicit risk |
| Consistency of VLANs/MTU | Prevents mysterious drops |
| Do not vPC across metro lightly | Latency/split-brain |

## Real-world — e-commerce DC access pair

**Brief:** Dual ToR vPC to dual-homed servers; team wants to extend same vPC domain to second hall “for HA.”

| R / C / A | Statement |
|---|---|
| R | Server dual-homing survives single ToR loss |
| C | Halls are 2 km apart; separate power |
| A | “One vPC domain across halls = better HA” — false |

**Decision:** vPC per hall; L3 between halls (or EVPN). Reject stretched vPC/VLAN between halls.

## Comparison to routed dual-homing

| Approach | Pros | Cons |
|---|---|---|
| vPC + L2 to server | Simple NIC teaming | L2 domain size risk |
| L3 to server / anycast GW | Clear domains | Host networking maturity |
| EVPN multihoming | Fabric scale | Skill / platform |

## Risks

- Peer-link as undocumented SPOF.
- Inconsistent configs between peers.
- Using multichassis to justify huge broadcast domains.

## Interview framing

“Multichassis LAG is for local dual-attach efficiency; I still bound VLANs tightly and I refuse metro-stretched vPC as a substitute for L3 DCI.”

## Related

- [STP and why to minimize L2](02_STP_and_Why_to_Minimize_L2.md)
- [L2 versus L3 access](04_L2_vs_L3_Access.md)
- [Leaf-spine versus three-tier](../14_Data_Center_and_Cloud/01_Leaf_Spine_vs_Three_Tier.md)

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
