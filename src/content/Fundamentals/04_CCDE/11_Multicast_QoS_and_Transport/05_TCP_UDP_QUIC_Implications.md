# TCP, UDP, and QUIC implications

Transport protocols change what the network must **optimize and observe**. Designing only for “bandwidth” misses latency, loss, and middlebox interactions.

## Protocol behaviors (design view)

| Protocol | Sensitive to | Network implications |
|---|---|---|
| TCP | Loss, buffering, RTT | Bufferbloat hurts; need AQM/sizing; ECMP reordering |
| UDP (real-time) | Jitter, loss, latency | QoS EF/AF; avoid huge buffers |
| QUIC (UDP/TLS) | Loss similarly; opaque payload | Less DPI visibility; still needs capacity & RTT |

```text
Voice/video:  UDP-like realtime → latency/jitter budget
Bulk:         TCP/QUIC → avoid loss + bufferbloat
SaaS:         Often QUIC/TLS → policy via IP/SNI/endpoint, not payload
```

## Middleboxes

| Middlebox | TCP era habit | QUIC reality |
|---|---|---|
| DPI firewall | Payload/app ID | Limited; use metadata/endpoint |
| WAN optimize | TCP tricks | Often bypass / limited |
| NAT | State | Still state; UDP timeouts matter |
| Load balancers | L7 HTTP | Different for QUIC versions |

## Real-world — call center + SaaS analytics

**Brief:** Softphones UDP; analytics move to QUIC SaaS; old WAN optimizer “helped web”; after change, users blame network for SaaS slowness while MOS is fine.

| R / C / A | Statement |
|---|---|
| R | Voice MOS first; SaaS p95 latency target second |
| C | Legacy optimizer on MPLS path only |
| A | “Turn on more QoS EF for SaaS QUIC” — wrong class |

**Decision:** Keep EF for voice; treat SaaS as critical data with capacity and clean RTT; bypass optimizer for QUIC; measure app RUM. Reject EF inflation for bulk SaaS.

## Design habits

1. Separate realtime vs elastic classes.
2. Size buffers / enable AQM on fat-long pipes.
3. Plan ECMP for reordering sensitivity.
4. Update security/visibility strategy for encrypted UDP.
5. Align SLOs with protocol truth.

## Risks

- Giant buffers “for TCP performance” destroying voice.
- Security policy assuming cleartext HTTP.
- Ignoring UDP session timeouts on FWs for long media.

## Interview framing

“I design path and QoS for protocol behavior—realtime UDP budgets versus TCP/QUIC elastic flows—and I update middleboxes for encryption reality.”

## Related

- [DiffServ end-to-end](04_DiffServ_End_to_End.md)
- [QoS as a design problem](03_QoS_as_a_Design_Problem.md)
- [User and application experience](../17_Automation_and_Observability/05_User_and_Application_Experience.md)

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
