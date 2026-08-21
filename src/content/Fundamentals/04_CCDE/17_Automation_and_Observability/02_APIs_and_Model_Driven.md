# APIs and model-driven networking

APIs and model-driven config (YANG/NETCONF/RESTCONF/gNMI, vendor APIs) turn the network into a **programmable system**. Design must define source of truth, transactions, and failure when automation is wrong.

## Why it matters to CCDE

| Topic | Design question |
|---|---|
| Source of truth | Controller, Git, NMS, or device? |
| Idempotency | Can we re-run safely? |
| Blast radius | Per-device vs fabric-wide push |
| AuthN/Z | Who can invoke APIs? |
| Observability | Intent vs actual |

```text
Intent (YAML/JSON/model)
  → pipeline validation
    → API to controller/devices
      → operational state telemetry
```

## Model-driven vs CLI automation

| Approach | Pros | Cons |
|---|---|---|
| CLI expect scrapers | Quick legacy | Fragile |
| Model-driven | Structured, validatable | Platform maturity |
| Controller API | Abstraction | Controller dependency |

## Real-world — multi-vendor campus CI

**Brief:** Mix of vendors; Ansible CLI playbooks drift; want NETCONF/REST where supported; change window 30 minutes nightly.

| R / C / A | Statement |
|---|---|
| R | Access VLAN/SVI changes with peer review and rollback |
| C | 40% devices API-poor |
| A | “One API fabric controller now” without inventory truth — false |

**Decision:** Git source of truth; model-driven where capable; CLI modules isolated; canary devices first. Reject big-bang controller without inventory.

## Safety patterns

1. Dry-run / candidate config.
2. Canary + automatic rollback.
3. Break-glass CLI with logging.
4. RBAC on automation identities.
5. Transaction size limits.

## Risks

- Two sources of truth (NMS vs Git).
- API outage blocking break-glass.
- Pushing unvalidated intent fabric-wide.

## Interview framing

“I design automation around a single source of truth, validated model-driven pushes, and bounded blast radius—with break-glass that still audits.”

## Related

- [Controller-based design](01_Controller_Based_Design.md)
- [CI/CD for network](03_CI_CD_for_Network.md)
- [Policy and orchestration planes](../04_Planes_and_Traffic_Flow/05_Policy_and_Orchestration_Planes.md)

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
