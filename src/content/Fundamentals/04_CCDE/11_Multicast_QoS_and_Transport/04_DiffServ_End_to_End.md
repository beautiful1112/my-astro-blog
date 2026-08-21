# DiffServ end-to-end

DiffServ works only if **classification, marking, trust, and scheduling** align across domains. A DSCP set at the access and ignored or remarked at the WAN is theater.

## End-to-end chain

```text
App/endpoint → Access classify/mark → Trust boundary
→ LAN schedulers → WAN/VPN map → Provider PHB?
→ DC/cloud edge → Destination
```

| Stage | Design question |
|---|---|
| Classify | Who marks—endpoint or network? |
| Trust | Where do we accept marks? |
| PHB | EF/AF/BE mappings; hardware queues |
| Remark | At SP/cloud seams? |
| Verify | SLO/MOS, not only “QoS enabled” |

## Typical class model (example)

| Class | Example | PHB habit |
|---|---|---|
| Realtime | Voice, some video | EF / strict priority (bounded) |
| Critical data | Trading, POS | AF with min bandwidth |
| Bulk | Backup | AF low / scavenger |
| Default | Best effort | BE |

Keep class count operable (often 4–6), not 20.

## Real-world — softphone + backup over SD-WAN

**Brief:** Voice complains at 09:00; nightly backups crush circuits; DSCP from phones trusted everywhere including guest Wi-Fi.

| R / C / A | Statement |
|---|---|
| R | Voice MOS acceptable during backup windows |
| C | Dual transport MPLS+DIA; guest Wi-Fi on same underlay edges |
| A | “Priority queue on hub only” is end-to-end — false |

**Decision:** Reclassify at trust boundary; police EF; shape/queue backups; map classes through SD-WAN policies on both transports. Untrust guest marks.

## SP and cloud seams

| Seam | Action |
|---|---|
| MPLS SP | Map to contracted PHB; document remark |
| Internet DIA | Assume BE; engineer locally |
| Cloud on-ramp | Check vendor remark behavior |

## Risks

- Too many classes → ops cannot tune.
- Untrusted endpoint marks → queue abuse.
- No measurement → endless debates.

## Interview framing

“DiffServ is an end-to-end contract: classify, trust, schedule, and map at every seam—or admit the path is best-effort.”

## Related

- [QoS as a design problem](03_QoS_as_a_Design_Problem.md)
- [TCP, UDP, QUIC implications](05_TCP_UDP_QUIC_Implications.md)
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

---
