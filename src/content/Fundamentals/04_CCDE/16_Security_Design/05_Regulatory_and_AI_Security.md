# Regulatory and AI security

Regulation and AI systems add **data-class and abuse** constraints to network design: residency, logging, model access paths, and prompt/data exfiltration—not only perimeter firewalls.

## Regulatory design inputs

| Input | Network implication |
|---|---|
| Residency | Pin paths/regions |
| Audit logging | Log locality + integrity |
| Least privilege | Segmentation / ZTNA |
| Breach notification | Detection coverage |
| Third-party processing | Extranet / SSE controls |

## AI-specific concerns

| Risk | Design response |
|---|---|
| Sensitive data to public LLM | Egress control, DLP/SSE, private models |
| Model/API key leakage | Secret paths, not flat Internet |
| Training data pipelines | Isolated fabric/VRF; controlled borders |
| Inference abuse / scraping | Rate limits, WAF, identity |
| Shadow AI SaaS | DNS/HTTP controls, discovery |

```text
User → corporate net → approved AI path (private/SSE)
                 ↘ block unsanctioned generative SaaS
```

## Real-world — bank Copilot-style rollout

**Brief:** Knowledge workers want public AI tools; PCI and customer PII must not leave; SOC wants full HTTP decrypt (legal/HR limits).

| R / C / A | Statement |
|---|---|
| R | Staff productivity with approved AI; PII/PCI never to public LLM |
| C | Privacy limits on TLS decrypt for some roles |
| A | “Block all UDP/443 AI domains forever” without approved path — fails adoption |

**Decision:** Approved enterprise AI with DLP; SSE categories for unsanctioned; PCI VRF cannot reach Internet AI; train users. Reject decrypt-everything as the only control.

## HLD checklist

1. Data classes touching AI.
2. Approved vs blocked destinations.
3. Logging what regulators need.
4. Separate training fabrics if needed.
5. Incident path for exfil detection.

## Risks

- Treating AI as “just another SaaS” without data-class rules.
- Over-blocking driving shadow IT via phones.
- Training clusters bridged into PCI.

## Interview framing

“I fold regulatory residency and AI exfil risk into path design—approved AI corridors, blocked shadow paths, and isolated training fabrics.”

## Related

- [Data sovereignty and governance](../03_Business_Strategy/07_Data_Sovereignty_and_Governance.md)
- [Segmentation](02_Segmentation.md)
- [AI fabric design notes](../14_Data_Center_and_Cloud/05_AI_Fabric_Design_Notes.md)

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
