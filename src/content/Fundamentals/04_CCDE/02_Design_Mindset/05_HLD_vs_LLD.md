# HLD versus LLD

**HLD** decides modules, responsibilities, and failure stories. **LLD** binds those decisions to identifiers, platforms, and templates. CCDE Written is HLD-heavy; Practical still expects LLD-aware feasibility.

## Definitions

| | HLD | LLD |
|---|---|---|
| Question | What are the pieces and why? | Exactly how is each piece built? |
| Audience | Architecture board, exam graders | Implementers, automation |
| Change rate | Slow (program-level) | Faster (release/templates) |
| Failure content | Domains, RTO mapping | Timers, holdovers, track objects |

```text
HLD:  "Dual edge PE, L3VPN hub-spoke, no DC stretch"
LLD:  "PE-A/B, RD/RT plan, BFD 300x3, QoS policy VOICE"
```

## What must appear in a CCDE-grade HLD

1. Business outcomes tied to numbered requirements.
2. Topology of **modules** (campus, WAN, DC, cloud seams).
3. Control vs data placement (IGP/BGP/controller roles).
4. HA and fate-share statements.
5. Security/segmentation seams.
6. Migration outline.
7. Explicit discarded alternative.

## What HLD should not become

| Anti-pattern | Problem |
|---|---|
| Port-channel spreadsheet | Wrong altitude; hides architecture |
| Feature checklist | No losers, no R/C/A |
| Single pretty drawing | No planes, no failure narrative |
| Copy-paste reference design | No constraint fit |

## Real-world — manufacturing plant + HQ redesign

**Brief:** OT network must stay isolated; IT campus refresh; 18-month program; auditors want diagrams “next week.”

| R / C / A | Statement |
|---|---|
| R | OT cannot share L2/broadcast with IT; IT voice RTO 30 s |
| C | OT change windows quarterly only; IT can change monthly |
| A | “One HLD diagram with every VLAN ID” satisfies both — false |

**Decision:** Deliver HLD with separate OT/IT modules, firewall PEP, and WAN seams first. LLD VLAN/IPs follow per module. Reject a single LLD-looking slide as the architecture package.

## Hand-off checklist HLD → LLD

| HLD invariant | LLD must preserve |
|---|---|
| No VLAN between buildings | Routed uplinks; SVI per closet only |
| Summaries at area border | Matching address plan |
| Dual PE no shared fate | Diverse circuits and power |
| PCI VRF | RD/RT and FW path |

## Risks

- LLD engineers “helpfully” stretch VLANs and break HLD.
- HLD so vague that any LLD is allowed.
- Updating LLD without revisiting HLD when requirements change.

## Interview framing

“HLD locks invariants—modules, seams, failure domains. LLD chooses knobs that keep those invariants true.”

## Related

- [Design is not implementation](02_Design_Is_Not_Implementation.md)
- [How to defend a design](06_How_to_Defend_a_Design.md)
- [Core CCDE terminology](07_Core_CCDE_Terminology.md)

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
