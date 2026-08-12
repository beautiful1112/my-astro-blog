# AI/ML as a business driver

CCDE v3.1 treats AI/ML as a **business and design** problem: data location, traffic patterns, security, assurance, cost, and governance—not “add GPUs somewhere.”

## What the business actually needs

| Need | Network/design implication |
|---|---|
| Train large models | East-west, often lossless, huge flows, storage adjacency |
| Infer at the edge | Latency budget, data gravity, sometimes disconnected |
| Use external AI SaaS | Egress, DLP, IP/PII leakage, contractual residency |
| Auto-scale | Elastic bandwidth and policy, not static overbuild only |
| Assurance / integrity | Telemetry of jobs and fabric; poison/integrity of data paths |

## Traffic and storage

Classic north-south enterprise patterns fail for training clusters. You design for **many-to-many elephant flows**, incast, and storage east-west. Internet edge size is usually the wrong knob.

```text
Data lake / object store
        ^  huge east-west
GPU/leaf-spine fabric
        ^  optional WAN for checkpoints / inference
Region / sovereignty boundary
```

## Cost and ROI

GPUs idle waiting on a blocking, oversubscribed fabric are a business failure. Network ROI is **job completion time and utilization**, not pretty oversubscription ratios copied from a 2012 DC.

## Governance

Who may send prompts and datasets to an external model? That is a **policy and logging** design, same family as DLP and CASB. See [regulatory and AI security](../16_Security_Design/05_Regulatory_and_AI_Security.md).

## Interview framing

“AI/ML changes data gravity, east-west, and governance. I design the fabric and the policy boundary for the job type—not a bigger Internet circuit with ‘AI’ in the title.”

---
