# Hierarchy and summarization

Hierarchy exists so you can **hide detail**: fewer prefixes, smaller blast radius, clearer policy seams. Flat networks feel simple until the control plane or human cognitive load collapses.

## Why hierarchy

| Without hierarchy | With hierarchy |
|---|---|
| Full mesh of detail everywhere | Summaries at borders |
| Every flap felt widely | Contained SPF/DUAL/BGP churn |
| Hard multi-team ownership | Module ownership |

```text
Access/closet prefixes
   → summarized at building/dist
      → summarized at campus/core
         → site aggregate to WAN
```

## Summarization rules of thumb

1. Address plan must **enable** summaries (design addressing first).
2. Summarize at **meaningful failure borders**, not randomly.
3. Know the cost: **suboptimal routing** / blackhole if components die behind a summary.
4. Pair with discard/null routes where needed.
5. Do not summarize past a point that destroys required TE or traffic engineering needs without a plan.

## Hierarchy patterns

| Domain | Typical hierarchy |
|---|---|
| Campus | Closet → building → core |
| WAN | Site → region → hub |
| DC | Leaf → spine (prefix habit via EVPN/IGP design) |
| SP | Access → aggregation → core |

## Real-world — logistics company flat OSPF

**Brief:** Single area 0 across 80 warehouses + HQ; SPF storms during flapping microwave links; addressing was sequential by install date.

| R / C / A | Statement |
|---|---|
| R | Microwave flap must not recompute campus core every time |
| C | Renumbering takes 12 months; dual hub already funded |
| A | “Just make everything stub” without renumber — limited help |

**Decision:** Introduce regional areas as warehouses are renumbered into summarizable blocks; stub/NSSA at edges; keep HQ as backbone. Reject more SPF timer tuning as the primary fix.

## Summary vs default

| Tool | Use |
|---|---|
| Specific aggregates | Preserve some path preference |
| Default-only stub | Maximize hiding; less optimality |
| Leaking select prefixes | Compromise for hubs/DCs |

## Risks

- Summarizing without a matching address plan.
- Over-summarizing and losing required path distinction.
- Hierarchy on slides only—adjacencies still flat.

## Interview framing

“I design hierarchy to bound control-plane scope: summarizable addressing at real borders, accepting suboptimal path as the explicit spend.”

## Related

- [Choosing an IGP](01_Choosing_an_IGP.md)
- [OSPF summarization and suboptimal routing](../07_OSPF_Design/04_Summarization_and_Suboptimal_Routing.md)
- [Summarizable address plans](../12_IPv6_and_Addressing/04_Summarizable_Address_Plans.md)

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
