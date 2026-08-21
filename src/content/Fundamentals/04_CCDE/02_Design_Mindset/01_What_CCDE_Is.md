# What CCDE is

CCDE is Cisco’s expert-level **network design** certification. It tests whether you can turn business and operational reality into a defensible architecture—not whether you can configure every feature under pressure.

## One-sentence definition

**CCDE = expert design judgment under constraints:** map requirements to options, choose with explicit trade-offs, and defend the result through failure, scale, security, cost, and migration.

## What it is not

| Myth | Reality |
|---|---|
| Harder CCIE | Different skill: selection and justification |
| Drawing pretty diagrams | Diagrams must encode failure domains and seams |
| Memorizing the blueprint list | Using the list as decision vocabulary |
| Always picking the newest Cisco architecture | Fit to R/C/A; sometimes boring wins |
| Pure theory without tech | You must know enough tech to reject impossible designs |

## Exam posture (v3.1 mental model)

```text
Written:  many short “which design fits?” decisions
Practical: sustained story—HLD, options, HA, migrate, defend
Both:     business language ↔ technology levers
```

You are expected to speak **planes, failure domains, summarization, policy points, and operability** fluently.

## Designer loop (memorize this)

1. Extract **requirements, constraints, assumptions**.
2. Produce **at least two** viable designs.
3. Compare on axes that matter (blast radius, cost, RTO, ops).
4. Select one; **name what you spend**.
5. Show migration and how you measure success.
6. State residual risk honestly.

## Real-world — regional ISP access redesign

**Brief:** Growth to 200k subscribers; old dual-homed L2 aggregation melts during storms; finance wants “cloud-managed Wi-Fi style” simplicity for the wireline edge.

| R / C / A | Statement |
|---|---|
| R | Access aggregation failure must not black-hole >5k subs for >2 minutes |
| C | Capex freeze on full chassis swap this FY; staff is IS-IS/MPLS fluent |
| A | “Controller-based access removes underlay design” — false |

**CCDE answer shape:** Keep IP/MPLS underlay with bounded IGP domains; push subscriber scale to BNGs/edge policy; reject campus-style huge L2 as the growth path. Defend with failure domain math, not feature slides.

## Skills employers actually buy

| Skill | On the job |
|---|---|
| Trade-off clarity | Architecture review boards |
| Fate-share detection | Post-incident redesign |
| Migration realism | Multi-year programs |
| Security/compliance mapping | Audit and sovereignty |
| Ops-aware design | Change success rate |

## Risks

- Studying only technologies and failing business/trade-off items.
- Over-fitting to a favorite reference architecture.
- Confusing certification prep with shipping designs that ops cannot run.

## Interview framing

“CCDE is the discipline of choosing a network that fits the business, proving why alternatives lose, and showing how we survive failure and change.”

## Related

- [Design is not implementation](02_Design_Is_Not_Implementation.md)
- [R/C/A](03_Requirements_Constraints_Assumptions.md)
- [CCDE versus CCIE](../01_Study_Roadmap/04_CCDE_vs_CCIE.md)

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
