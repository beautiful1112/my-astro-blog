# Summarization and suboptimal routing

OSPF summaries buy **stability and scale**; they spend **path optimality** and can black-hole if a component behind the summary dies without a more specific extant route.

## Mechanics (design view)

```text
Area 10 prefixes 10.10.0.0/16 components
ABR advertises 10.10.0.0/16 into area 0
Far routers: one next hop via ABR
If one /24 dies and no alternate more-specific → blackhole into summary
```

## When to summarize

| Summarize | Do not (yet) |
|---|---|
| Stable building aggregates | Tiny domains needing TE per /24 |
| Edge areas with renumbered blocks | Messy non-contiguous space |
| Toward WAN/hub | Across a seam that needs specific exits |

## Suboptimal routing acceptance

| Situation | Accept suboptimal? |
|---|---|
| Campus users to Internet | Usually yes via default/summary |
| DC east-west elephant flows | Often no—keep specifics / better fabric |
| Dual ABR unequal capacity | Watch cold-potato effects |

State acceptance explicitly in the defense.

## Real-world — airport dual ABR surprise

**Brief:** Terminal areas summarize to core; one ABR loses half its terminals but still advertises the aggregate; traffic black-holes.

| R / C / A | Statement |
|---|---|
| R | Terminal loss must not suck traffic into dead ABR |
| C | Summaries required for core LSDB |
| A | “Summary always tracks liveliness automatically” — false without design |

**Decision:** Dual ABRs with careful summary conditioning / more-specifics on failure / or smaller summary scopes per ABR footprint. Reject naive always-on aggregates.

## Mitigations

| Technique | Role |
|---|---|
| Discard route on ABR | Anti-loop for summary |
| Conditional summary | Withdraw when empty |
| Smaller hierarchy tiles | Limit blast of wrong ABR |
| Monitoring | Alert on summary without components |

## Risks

- Summarizing non-contiguous space.
- Forgetting discard routes.
- Using summary to hide a bad address plan forever.

## Interview framing

“I summarize to bound OSPF scope and I explicitly accept suboptimal path—or I design conditional summaries so dead components do not attract traffic.”

## Related

- [Hierarchy and summarization](../06_Routing_Protocol_Selection/02_Hierarchy_and_Summarization.md)
- [OSPF area design](01_OSPF_Area_Design.md)
- [ABR and ASBR placement](02_ABR_and_ASBR_Placement.md)

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
