# VLAN and broadcast design

VLANs are **broadcast domains with policy tags**, not security magic by themselves. Design VLAN scope for containment, address hygiene, and clear L3 boundaries.

## Goals

| Goal | Practice |
|---|---|
| Contain storms | Small VLANs; storm control |
| Clear gateway | One SVI intent per VLAN; FHRP/anycast plan |
| Security | VLAN ≠ zone; need ACL/FW/SG |
| Ops clarity | Naming, documentation, no “VLAN for everything” |

```text
User VLAN  (closet only)
Printer VLAN (closet/floor)
Voice VLAN (closet; QoS)
→ L3 boundary at dist/leaf
→ No VLAN trunk between buildings
```

## Sizing heuristics (starting points, not dogma)

| Environment | Typical habit |
|---|---|
| Campus closet | 1–2 user VLANs per closet/stack |
| DC | VLAN/VNI per app tier or smaller; avoid hall-wide |
| Guest | Isolated; hairpin to scrubbing |

Revisit when ARP/ND or unknown unicast rates hurt.

## Broadcast and unknown unicast

| Issue | Design response |
|---|---|
| Chatty discovery protocols | Segment; rate-limit |
| L2 extension for “simplicity” | Prefer L3 |
| Wireless roaming needs | Controller architecture—not campus VLAN stretch by default |

## Real-world — media company edit floors

**Brief:** Editors want same VLAN for shared storage discovery; storms already hurt; security wants contractor isolation.

| R / C / A | Statement |
|---|---|
| R | Edit rooms keep low-latency storage access; contractors cannot reach edit VLANs |
| C | Legacy NAS expects L2 discovery in-room |
| A | “One flat VLAN for all floors enables collaboration” — false |

**Decision:** Per-room or per-floor storage VLAN with local NAS; L3 between floors; contractors on separate VRF/VLAN + FW. Reject building-wide production VLAN.

## VLAN vs VRF vs security group

| Tool | Primary job |
|---|---|
| VLAN/VNI | L2 segment boundary |
| VRF | L3 routing isolation |
| SG / microseg | Who-to-whom intent |

Use the smallest tool that meets the requirement; often combine.

## Risks

- VLAN sprawl without address plan.
- Trunks that accidentally merge domains.
- Believing VLAN = compliance control.

## Interview framing

“I size VLANs for broadcast containment and pair them with L3 and real PEPs—VLAN IDs alone are not a security architecture.”

## Related

- [L2 failure domains](01_L2_Failure_Domains.md)
- [STP and why to minimize L2](02_STP_and_Why_to_Minimize_L2.md)
- [Segmentation](../16_Security_Design/02_Segmentation.md)

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
