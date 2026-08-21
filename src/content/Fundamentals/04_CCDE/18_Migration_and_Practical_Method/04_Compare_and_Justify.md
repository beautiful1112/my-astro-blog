# Compare and justify

CCDE answers are **comparisons**. If you only praise your favorite design, you have not justified it.

## Minimum comparison kit

| Element | Content |
|---|---|
| Option A | Short description |
| Option B | Short description |
| Buy/spend table | Axes that matter to this brief |
| Decision | Which wins and which R/C/A killed the other |
| Residual risk | What remains |

```text
Option A vs Option B
  → score against numbered R/C/A
  → pick winner
  → say loser reason in one sentence
```

## Axes to score (pick relevant)

Failure domain, RTO, cost, ops skill, migration time, security/compliance, scalability, vendor lock.

Do not score 12 axes every time—score what the scenario cares about.

## Real-world — campus refresh options

**A:** L3 access, tiny L2 closets. **B:** vPC distribution, wide VLANs.

| Axis | A | B |
|---|---|---|
| Blast radius | Better | Worse if VLAN stretch |
| Phase-1 speed | Slower | Faster familiar |
| Ops skill | Needs routing fluency | STP/vPC fluency |
| PCI isolation | Cleaner | Harder if flat |

| R / C / A | Statement |
|---|---|
| R | Contain storms after prior outage |
| C | 2-person NOC; 9 months |
| A | “Familiar equals safer” — challenge after STP meltdown |

**Decision:** A for PCI/new buildings; B only temporary in one non-PCI building without stretch.

## Justification language

| Strong | Weak |
|---|---|
| “Killed B because R2 blast radius” | “B is outdated” |
| “Spend more IGP edges” | “Best practice” |
| “Residual: skill ramp” | “Zero risk” |

## Risks

- Fake option B (strawman).
- Changing axes mid-defense.
- No residual risk.

## Interview framing

“I always keep a real alternative, score it on the brief’s axes, and justify the winner by the requirement that killed the loser.”

## Related

- [How to defend a design](../02_Design_Mindset/06_How_to_Defend_a_Design.md)
- [Trade-off thinking](../02_Design_Mindset/04_Trade_Off_Thinking.md)
- [Extract requirements](03_Extract_Requirements.md)

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
