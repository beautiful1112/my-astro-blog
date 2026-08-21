# How to defend a design

A defense is a short, structured argument: **outcome → choice → rejected alternative → risk → proof**. Length varies; structure does not.

## 60-second template

1. **Outcome:** What business result must stay true?
2. **Choice:** What did you pick (one sentence)?
3. **Loser:** What popular option did you discard and why?
4. **Spend:** What did you pay (cost, complexity, suboptimal path)?
5. **Proof:** How do you measure (RTO test, failure drill, KPI)?

```text
"For RTO 30s voice (R1), I chose dual-homed L3 access with BFD
 instead of stretched VLAN+FHRP, because STP fate-share failed
 last year. I spend more IGP edges and training. We prove with
 quarterly link-pull tests and MOS tickets."
```

## Evidence types that land

| Evidence | Example |
|---|---|
| Numbered requirement | R3: PCI not in user flood domain |
| Constraint | Two-person NOC; no IS-IS this year |
| Failure history | Prior campus STP outage |
| Scale math | Prefixes, sessions, LSDB |
| Ops reality | Who debugs at 03:00 |
| Migration | Phase that avoids big-bang |

## Weak defenses (avoid)

| Weak | Why it fails |
|---|---|
| “Industry best practice” | No fit to this R/C/A |
| “Vendor recommended” | Authority ≠ constraint analysis |
| “More redundant” | May increase shared fate |
| “We’ll tune timers later” | Hides missing HA design |
| Feature tour | No loser |

## Real-world — architecture review board (ARB)

**Brief:** Team proposes EVPN-VXLAN campus fabric for 2,000 users; ARB includes security and finance.

| R / C / A | Statement |
|---|---|
| R | Contain broadcast incidents to a closet; support guest isolation |
| C | Budget allows fabric OR dual distribution refresh, not both + training binge |
| A | “Fabric is always the modern answer” — must be defended |

**Strong defense:** If skills and tooling exist, fabric buys automation and L3 at edge; spend is ops model change. If constraint is thin staff, defend hierarchical L3 campus with tiny L2 closets as the fit—and show EVPN as a later phase. Either way, name the loser.

## Practical exam habit

| Step | Action |
|---|---|
| Before drawing | Write R/C/A bullets |
| After drawing | Write one discarded option |
| Before submit | Read defense aloud; cut slogans |

## Risks

- Defending aesthetics or familiarity instead of requirements.
- Hiding residual risk (graders notice).
- Contradicting your own migration story.

## Interview framing

“I defend by tying the choice to a numbered requirement, naming the alternative I killed, and stating how we will prove the outcome under failure.”

## Related

- [Trade-off thinking](04_Trade_Off_Thinking.md)
- [R/C/A](03_Requirements_Constraints_Assumptions.md)
- [Compare and justify](../18_Migration_and_Practical_Method/04_Compare_and_Justify.md)

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
