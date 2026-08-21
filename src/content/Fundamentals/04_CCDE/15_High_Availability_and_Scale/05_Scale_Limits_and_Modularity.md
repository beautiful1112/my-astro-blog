# Scale limits and modularity

Every design hits a **scale cliff**: prefixes, sessions, LSDB, MAC tables, policy rules, human cognition. Modularity is how you add capacity without resetting the blast radius.

## Scale dimensions

| Dimension | Cliff example | Modular response |
|---|---|---|
| Prefixes | IGP LSDB | Areas/levels, BGP seams |
| Sessions | BGP full mesh | RR, confederations |
| MACs / ARPs | Huge L2 | Smaller domains, L3 |
| Policies | ACL lines | Groups, controllers, hierarchy |
| Teams | Ticket chaos | Clear module ownership |
| Power/cooling | Hall limits | Pods |

```text
Grow by adding modules (pods/sites/areas)
Not by enlarging one domain forever
```

## Design habit

1. Name the metric that will fail first.
2. Set a soft threshold (e.g., 60% of platform).
3. Define the next module pattern before hitting 90%.
4. Keep inter-module seams stable (aggregates, RR, borders).

## Real-world — SaaS company DC growth

**Brief:** Single leaf-spine fabric growing past comfortable MAC/TE limits; desire to “add more spines” while keeping one huge L2 tenant.

| R / C / A | Statement |
|---|---|
| R | Double GPU/app capacity in 12 months without fabric-wide failure domain |
| C | One security domain today; limited renumber windows |
| A | “More spines fix any scale problem” — incomplete |

**Decision:** Pod modularity with EVPN/L3 borders; split noisy tenants; keep spines within pod. Reject infinite single-fabric L2.

## Modularity vs complexity

| Too little modularity | Too much |
|---|---|
| One domain meltdown | Seam sprawl, redistribute hell |
| | Fix: planned seams (BGP/VRF), not random |

## Risks

- Scaling hardware vertically only.
- Ignoring operational scale (who understands it).
- Modules without summarizable addressing.

## Interview framing

“I design to the first scale cliff and grow by modules with stable seams—not by enlarging a single failure domain.”

## Related

- [Failure domains](01_Failure_Domains.md)
- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)
- [AI fabric design notes](../14_Data_Center_and_Cloud/05_AI_Fabric_Design_Notes.md)

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
