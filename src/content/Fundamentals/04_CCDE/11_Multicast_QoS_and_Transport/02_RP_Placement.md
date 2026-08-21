# RP placement

In PIM-SM ASM, the **Rendezvous Point (RP)** is a control-plane meeting place for sources and receivers. Placement is a failure-domain and scale decision—not a random loopback choice.

## What RP placement affects

| Factor | Impact |
|---|---|
| Geography | Shared-tree latency before SPT switch |
| Redundancy | Anycast-RP / MSDP / BSR strategy |
| Scope | Domain boundaries; unwanted trees |
| Ops | Who notices RP loss |

```text
Source → first-hop DR → (registers) → RP
Receivers → joins toward RP
Then often SPT switch source→receivers
```

## Placement patterns

| Pattern | Good for | Watch |
|---|---|---|
| Anycast-RP in dual hubs | Enterprise WAN | Consistent MSDP/sync |
| RP in DC | Sources centralized | Remote receiver warm-up |
| RP per region | Scale / containment | Interdomain multicast |
| SSM (no RP) | When apps support | App readiness |

## Prefer SSM when possible

SSM removes RP dependency. If the brief allows application/IGMP support, SSM is often the cleaner design.

## Real-world — stadium + HQ video

**Brief:** Live cameras at venues; transcoders at HQ DC; prior outage when single RP in HQ died during game day.

| R / C / A | Statement |
|---|---|
| R | Venue contribution survives single HQ RP loss |
| C | Mix of ASM cameras; new cameras can do SSM |
| A | “Two RPs without anycast/MSDP plan” equals HA — false |

**Decision:** Anycast-RP at dual DCs for legacy ASM; migrate new flows to SSM; bound domains so stadium failure does not flood unrelated campuses.

## Checklist

1. ASM or SSM?
2. Where are sources vs receivers?
3. RP redundancy mechanism?
4. Multicast domain borders (scopes, boundaries)?
5. SPT switch behavior acceptable for RTO?

## Risks

- Single RP SPOF.
- RP in unstable edge.
- Spanning multicast across security zones casually.

## Interview framing

“I place RPs for source/receiver geography and redundancy—or I eliminate them with SSM when applications allow.”

## Related

- [Multicast design choices](01_Multicast_Design_Choices.md)
- [Multicast library](../../01_Multicast/Multicast_Deep_Dive.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)

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
