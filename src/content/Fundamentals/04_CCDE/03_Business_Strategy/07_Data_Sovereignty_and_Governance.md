# Data sovereignty and governance

Data sovereignty is about **where data may live, traverse, and be administered**—not only “we use encryption.” Governance turns law and policy into placement and logging rules the network must enforce.

## Design-relevant questions

| Question | Network implication |
|---|---|
| Where may data at rest reside? | Region pin; private DC vs public cloud |
| Where may data in transit go? | Path control; no surprise breakout |
| Who may administer? | Break-glass, privilege locality |
| What must be logged / retained? | PEP + logging path residency |
| Cross-border backups OK? | DR design ≠ automatic replica abroad |

```text
App says "multi-region HA"
Law says "citizen data stays in-country"
Design must satisfy both or escalate the conflict
```

## Patterns

| Pattern | Use when | Cost |
|---|---|---|
| In-country dual DC | Strict residency + HA | Capex |
| Cloud region lock + controls | Cloud OK in one jurisdiction | Feature limits |
| Split stacks | Different data classes | Ops complexity |
| Encryption only | Weak substitute for residency | May fail audit |

Encryption without placement control rarely satisfies sovereignty alone.

## Real-world — EU healthcare SaaS edge

**Brief:** Hospital group adopts SaaS analytics; patient identifiers must stay in-country; vendor’s default is US region with global CDN.

| R / C / A | Statement |
|---|---|
| R | Identifiers and clinical notes remain in-country at rest and in primary processing |
| C | Vendor offers one in-country region; CDN edges are global |
| A | “TLS to SaaS equals sovereignty” — false |

**Decision:** Use in-country region, disable unauthorized cross-region replicas, keep identity/token brokers local, and document CDN caching rules for non-PHI static assets only. Reject default global SaaS as-is.

## Network controls that support governance

| Control | Role |
|---|---|
| VRF / SDN segmentation | Separate regulated classes |
| Explicit DIA / on-ramp | Prevent shadow SaaS paths |
| DNS and HTTP controls | Reduce unmanaged egress |
| Logging locality | Audit evidence stays legal |
| Contractual + technical | Both required |

## Risks

- DR in a foreign region that violates policy.
- Admin plane hosted abroad with full data access.
- Shadow IT bypassing designed paths.

## Interview framing

“Sovereignty is a placement and path constraint: I pin data classes to jurisdictions, control breakout, and refuse HA designs that silently replicate abroad.”

## Related

- [Business to technical mapping](01_Business_to_Technical_Mapping.md)
- [Cloud on-ramp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)
- [Regulatory and AI security](../16_Security_Design/05_Regulatory_and_AI_Security.md)

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
