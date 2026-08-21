# Stub and NSSA as design tools

OSPF stub variants are **control-plane filters**, not security boundaries. Use them to hide external/inter-area detail from edges that do not need it.

## Tool map

| Area type | What edges see | Typical use |
|---|---|---|
| Normal | Inter-area + externals (as designed) | Transit, complex |
| Stub | Default (no AS-external) | Campus edges |
| Totally stubby | Default only (Cisco) | Aggressive hide |
| NSSA | External locally injected; filtered to backbone rules | Redistribute at edge |
| Totally NSSA | NSSA + default-only toward area | Edge + redistribute |

```text
Edge area (stub/NSSA)
   ABR
Area 0
   ASBR (if externals)
```

## Design intent

| Intent | Choose |
|---|---|
| Shrink LSDB on access | Stub / totally stubby |
| Inject DC/static at edge | NSSA |
| Prevent area from becoming transit | Address + ABR placement |

## Costs

- Suboptimal exit (everything follows default).
- Harder troubleshooting (“where did the prefix go?”).
- Misuse as “security” without VRF/FW.

## Real-world — retail stores as OSPF edges

**Brief:** Stores redistributed connected; full externals flooded everywhere; store routers CPU spikes.

| R / C / A | Statement |
|---|---|
| R | Store needs default to hub; local POS subnets stay local |
| C | Some stores inject partner /30s via redistribute |
| A | “Make all areas stub” while still redistributing — wrong tool |

**Decision:** NSSA (or totally NSSA) for stores that redistribute; stub for pure defaults; summarize at ABR. Reject flooding Internet or partner tables store-wide.

## Placement reminders

- ABRs enforce area type; place ABRs where hierarchy already exists.
- Multiple ABRs need consistent summary/default strategy.
- NSSA translators and filtering are part of the HLD, not an afterthought.

## Risks

- Stub where specific inter-area prefixes are required.
- NSSA loops with careless redistribute.
- Assuming stub stops lateral attacks.

## Interview framing

“I use stub/NSSA to hide control-plane detail at edges—pairing area type with ABR placement and accepting default-driven exit as the spend.”

## Related

- [OSPF area design](01_OSPF_Area_Design.md)
- [ABR and ASBR placement](02_ABR_and_ASBR_Placement.md)
- [Redistribution as a design smell](../06_Routing_Protocol_Selection/03_Redistribution_as_a_Design_Smell.md)

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
