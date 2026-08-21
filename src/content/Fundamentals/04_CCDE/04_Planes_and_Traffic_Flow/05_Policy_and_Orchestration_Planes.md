# Policy and orchestration planes

Beyond classic control/data/management, modern designs add **policy** (intent: who may talk, with what QoS/path) and **orchestration** (systems that render intent into device state). CCDE asks where intent lives and what fails when the controller is sick.

## Plane map

| Plane | Job | Examples |
|---|---|---|
| Policy | Express intent | SGBAC rules, SD-WAN app policy, RBAC intent |
| Orchestration | Compile/deploy intent | Controllers, CI pipelines, Ansible |
| Control | Distributed signaling | OSPF, BGP, EVPN |
| Data | Forward | ASIC FIB, labels |
| Management | Operate devices | SSH, streaming telemetry |

```text
Intent (policy)
   → Orchestrator / controller
      → Device config + control protocols
         → Data-plane entries
```

## Design choices

| Model | Pros | Cons |
|---|---|---|
| Fully distributed policy (ACLs everywhere) | No controller SPOF | Drift, scale pain |
| Central controller | Consistent intent | Dependency; need cache/fail-open/closed |
| Hybrid | Local defaults + central updates | Complexity of failure modes |

**Fail-open vs fail-closed** must be explicit per domain (campus access vs PCI).

## Real-world — retail SD-WAN + SASE

**Brief:** 900 stores; central policy for SaaS allowlists; local POS must work if cloud controller unreachable for 2 hours.

| R / C / A | Statement |
|---|---|
| R | POS VLAN keeps working offline from controller; new SaaS blocks can wait |
| C | Single vendor controller multi-tenant cloud |
| A | “Cloud controller HA means stores never need local policy cache” — false |

**Decision:** Critical POS permit cached on edge; fail-open for POS, fail-closed for guest. Orchestration pushes non-critical allowlists. Reject pure cloud-dependent policy for revenue traffic.

## Questions to force in HLD

1. Where is source of truth for policy?
2. What is last-known-good on the device?
3. Who can break-glass without the orchestrator?
4. How do you audit intent vs rendered config?
5. What is blast radius of a bad policy push?

## Risks

- Controller as silent SPOF for forwarding.
- Orchestration without conflict resolution (two sources of truth).
- Policy plane that cannot be explained in a failure review.

## Interview framing

“I place policy and orchestration explicitly: where intent lives, how it renders, and whether critical forwarding fails open or closed when the controller is gone.”

## Related

- [Control, data, management planes](01_Control_Data_Management_Planes.md)
- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [APIs and model-driven](../17_Automation_and_Observability/02_APIs_and_Model_Driven.md)

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
