# User and application experience

Green links do not mean users are happy. Design must include **experience signals**—latency, loss, MOS, error budgets—and paths that protect critical apps under congestion.

## From infrastructure to experience

| Layer | Signal |
|---|---|
| Device | CPU, interface errors |
| Path | RTT, jitter, loss |
| Application | Apdex, MOS, transaction time |
| User | Tickets, RUM, Wi-Fi scores |

```text
SLO (app) → network budgets (latency/loss)
         → QoS + capacity + path choice
         → telemetry that sees the app
```

## Design implications

| Requirement | Network response |
|---|---|
| Voice MOS | EF, low jitter paths, avoid bufferbloat |
| Trading / POS | Loss-sensitive capacity; diverse exits |
| Bulk backup | Scavenger class; off-peak |
| SaaS | DIA on-ramp; measure actual SaaS RTT |

## Real-world — airline ops apps

**Brief:** Dispatch apps feel “slow” at shift change; MPLS utilization 45%; Wi-Fi sticky clients; Internet SaaS added last year via DC hairpin.

| R / C / A | Statement |
|---|---|
| R | Dispatch p95 <2 s; voice OK |
| C | Cannot rip Wi-Fi this quarter |
| A | “Add bandwidth to MPLS” first — may miss hairpin and Wi-Fi |

**Decision:** Measure app path; move SaaS to DIA/SSE; fix Wi-Fi sticky; keep MPLS for private apps. Reject blind bandwidth buy.

## Observability minimums

1. Synthetic transactions for top apps.
2. Path-aware telemetry (not only link).
3. QoS drop counters visible.
4. Feedback into capacity planning.

## Risks

- Only SNMP green/red operations.
- Over-QoS without capacity.
- Ignoring wireless and DNS in “network” UX.

## Interview framing

“I design to application SLOs: path, QoS, and telemetry that show user experience—not only interface counters.”

## Related

- [Visibility, observability, assurance](04_Visibility_Observability_Assurance.md)
- [DiffServ end-to-end](../11_Multicast_QoS_and_Transport/04_DiffServ_End_to_End.md)
- [Cloud on-ramp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)

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
