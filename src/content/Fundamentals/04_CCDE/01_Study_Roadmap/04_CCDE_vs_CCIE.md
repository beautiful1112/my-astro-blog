# CCDE versus CCIE

CCIE proves you can **implement and troubleshoot** complex systems. CCDE proves you can **choose and defend** architectures under business and operational constraints. Overlap exists; the exam center of gravity does not.

## Core contrast

| Axis | CCIE | CCDE |
|---|---|---|
| Primary verb | Configure / verify / fix | Select / compare / justify |
| Artifact | Working network | Defensible design + migration |
| Failure focus | Restore service now | Bound blast radius by design |
| Success metric | Correct behavior / reachability | Fit to R/C/A and risk appetite |
| Depth | Platform and feature detail | Trade-offs and seams |
| Typical trap | Wrong knob | Right tech, wrong problem |

```text
CCIE:  "Make this topology work and stay up."
CCDE:  "Should this topology exist, and what do we spend to keep it?"
```

## Shared foundation

Both expect solid routing, switching, security, and overlay literacy. CCDE **reuses** that literacy as vocabulary for decisions. You still need to know what OSPF areas, BGP RRs, EVPN, and SD-WAN *do*—you are graded on *whether they belong*.

## When each credential signals value

| Situation | Stronger signal |
|---|---|
| NOC / escalation / implementation lead | CCIE (or equivalent depth) |
| Architecture board / RFP / multi-year roadmap | CCDE |
| Small team wearing both hats | Both skills; certs optional |
| Vendor bake-off without business framing | Neither alone—add R/C/A |

## Real-world — hospital network rebuild RFP

**Brief:** Clinical apps RTO 60 s; medical devices on constrained VLANs; two vendors proposing “full fabric refresh.”

| R / C / A | Statement |
|---|---|
| R | Clinical traffic survives single core/distribution failure within 60 s |
| C | Cannot rip clinical VLANs in one weekend; staff is Cisco-heavy |
| A | “CCIE on staff means the HLD is sound” — insufficient |

**Decision:** Score proposals on failure domains, migration phases, and sovereignty of PHI paths—not on who can list more features. A CCDE-style defense beats a lab-perfect but stretched-L2 design.

## Study implication

| If you have… | Add for CCDE |
|---|---|
| Strong CCIE | Business mapping, trade-off language, migration, “when not” |
| Strong architect theory, weak protocols | Enough protocol truth to avoid impossible designs |
| Neither | Start with R/C/A + one campus and one WAN case |

## Risks

- Treating CCDE as “CCIE without labs.”
- Ignoring implementation feasibility so designs cannot be built.
- Using CCIE depth to hide missing business alignment.

## Interview framing

“CCIE asks if I can make the network behave; CCDE asks if I chose the right network for the business and can prove it under failure.”

## Related

- [What CCDE is](../02_Design_Mindset/01_What_CCDE_Is.md)
- [Written versus Practical](03_Written_vs_Practical.md)
- [How to defend a design](../02_Design_Mindset/06_How_to_Defend_a_Design.md)

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
