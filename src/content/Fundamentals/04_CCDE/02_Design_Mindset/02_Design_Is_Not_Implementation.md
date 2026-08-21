# Design is not implementation

Design answers **what** and **why** at the level of modules, seams, and failure domains. Implementation answers **how** on a specific platform and change window. CCDE lives mostly in design; it still respects implementation feasibility.

## Separation of concerns

| Layer | Questions | Example artifact |
|---|---|---|
| Business | Outcome, risk, money, time | RTO 30 s for voice; PCI scope |
| HLD | Modules, protocols roles, HA story | Dual DC, L3 DCI, VRF for PCI |
| LLD | IDs, timers, platforms, templates | Area IDs, BFD 300 ms, QoS map |
| Build | CLI/API, crates, validation | Change ticket, CI pipeline |

```text
Business  →  HLD  →  LLD  →  Build
   ↑_________________|
   (feedback: cost, ops, failure)
```

Jumping from business straight to CLI skips the decisions CCDE grades.

## What belongs in HLD vs LLD

| Belongs in HLD | Belongs in LLD / build |
|---|---|
| OSPF multi-area with building summaries | Exact area numbers and SPF timers |
| Dual PE, diverse fibers | Optics SKU and fiber ID |
| BGP for Internet policy | Community strings and route-maps |
| “No stretched VLAN between DCs” | VLAN ID spreadsheet |

## Feasibility without drowning in CLI

Designers must know enough to reject fantasy:

- “Sub-second RTO” with single-homed CPE and no BFD is fantasy.
- “Global anycast gateway” with huge L2 stretch is a fate-share fantasy.
- “Encrypt everything” with no PEP or key ops plan is incomplete.

You do not need every knob—only the constraints those knobs imply.

## Real-world — “just turn up SD-WAN” project

**Brief:** CIO saw a demo; asks engineering to “implement SD-WAN next quarter” for 400 branches.

| R / C / A | Statement |
|---|---|
| R | Branch apps survive hub maintenance; prioritize POS and voice |
| C | Underlay is single MPLS + backup Internet; no dual circuits yet |
| A | “Buying SD-WAN appliances is the design” — false |

**Design first:** Define transport independence goals, hub HA, DIA breakout policy, and underlay SLAs. **Then** implement templates. Skipping HLD produces overlay lipstick on a single-homed underlay SPOF.

## Collaboration model

| Role | Owns |
|---|---|
| Architect / CCDE thinker | HLD, options, risk register |
| Domain engineer | LLD, platform fit |
| Ops | Runbooks, observability, change risk |
| Security | Trust boundaries, PEP, compliance |

## Risks

- HLD that cannot be built (ignores MTU, scale, or skill).
- LLD that invents architecture (secret stretched VLANs).
- Docs that mix both so reviews never finish.

## Interview framing

“I separate design from implementation: I lock modules, seams, and failure domains first—then I let LLD choose knobs that preserve those invariants.”

## Related

- [HLD versus LLD](05_HLD_vs_LLD.md)
- [What CCDE is](01_What_CCDE_Is.md)
- [Implementation and migration plans](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)

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
