# FHRP, NSF, GR, and BFD

These tools cover different parts of the **availability stack**. Mixing them up—or expecting one to replace diversity—is a common design error.

## Tool roles

| Tool | Plane | Job |
|---|---|---|
| FHRP (HSRP/VRRP/GLBP) | First hop | VIP continuity for hosts on L2 segment |
| BFD | Detection | Fast liveliness of neighbors/paths |
| NSF | Forwarding during control restart | Keep FIB while control restarts |
| GR / graceful restart | Control helper behavior | Neighbor preserves routes during restart |

```text
Diversity of paths          → survive hard failures
BFD                         → notice fast
FRR / ECMP                  → switch fast
NSF/GR                      → survive control restarts
FHRP                        → host default gateway story
```

## What each does not do

| Tool | Not a substitute for |
|---|---|
| FHRP | Dual WAN circuits or L3 ECMP campus |
| BFD | A second path |
| NSF/GR | Protection from link/node hard down without alternate |
| Faster FHRP timers alone | Fixed shared L2 fate |

## Real-world — campus voice gateway

**Brief:** Dual dist switches with HSRP; BFD between dist and core; single building fiber; voice RTO target 1 s; prior outage was fiber cut—not supervisor restart.

| R / C / A | Statement |
|---|---|
| R | Voice survives single dist or uplink loss within 1 s |
| C | One conduit to building today; second funded next FY |
| A | “NSF on supervisors meets RTO for fiber cut” — false |

**Decision:** BFD + tuned FHRP tracking for dist/node loss; admit conduit SPOF until diverse fiber; plan L3 access. Reject NSF as the fiber story.

## Design pairing

| Scenario | Pairing |
|---|---|
| Host gateway on VLAN | FHRP or anycast GW + tracked uplinks |
| Routed ECMP access | Often less FHRP need |
| Control restart windows | NSF/GR where platforms support |
| Aggressive RTO | BFD + FRR + diversity |

## Risks

- Micro-BFD on unstable links.
- FHRP across huge L2 domains.
- GR masking persistent software faults without monitoring.

## Interview framing

“I use FHRP for first hop, BFD for detection, NSF/GR for control restarts—and I never claim they replace path diversity.”

## Related

- [Fast convergence design](../06_Routing_Protocol_Selection/04_Fast_Convergence_Design.md)
- [RTO/RPO to HA mapping](02_RTO_RPO_to_HA_Mapping.md)
- [Fate sharing](04_Fate_Sharing.md)

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
