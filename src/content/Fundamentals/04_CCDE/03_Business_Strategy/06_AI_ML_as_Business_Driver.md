# AI/ML as a business driver

CCDE treats AI/ML as a **business and design** problem: data location, traffic patterns, security, assurance, cost, and governance—not “add GPUs somewhere” or “bigger Internet pipe.”

## What the business actually needs

| Need | Network/design implication |
|---|---|
| Train large models | East-west, often lossless, huge flows, storage adjacency |
| Infer at the edge | Latency budget, data gravity, sometimes disconnected |
| Use external AI SaaS | Egress, DLP, IP/PII leakage, contractual residency |
| Auto-scale | Elastic bandwidth and policy, not static overbuild only |
| Assurance / integrity | Telemetry of jobs and fabric; poison/integrity of data paths |
| Human-in-the-loop ops | Change freezes, model rollback paths, audit logs |

Training, inference, and SaaS consumption are **three different designs**. Collapsing them into one “AI VLAN” is a smell.

## Traffic and storage

Classic north-south enterprise patterns fail for training clusters. You design for **many-to-many elephant flows**, incast, and storage east-west. Internet edge size is usually the wrong knob.

```text
Data lake / object store
        ^  huge east-west
GPU leaf-spine fabric (underlay simple, overlay/tenant optional)
        ^  WAN only for checkpoints / inference / sync
Region / sovereignty boundary
```

| Pattern | Dominant traffic | Design focus |
|---|---|---|
| Training cluster | East-west GPU↔GPU and GPU↔storage | Fabric BW, congestion, RoCE/lossless or adequate deep buffers |
| Edge inference | Local + occasional cloud | Latency, offline mode, model distribution |
| Copilot / SaaS LLM | North-south HTTPS | Egress control, DLP, identity, logging |

## Cost and ROI

GPUs idle waiting on a blocking, oversubscribed fabric are a business failure. Network ROI is **job completion time and utilization**, not pretty oversubscription ratios copied from a 2012 enterprise DC.

| Spend | Good signal | Bad signal |
|---|---|---|
| Non-blocking (or planned) fabric | Job time drops, GPUs busy | Fancy topology, same job time |
| DCI for datasets | Meets residency + schedule | Stretch L2 “for convenience” |
| SaaS AI seats | Policy + logging in place | Open egress “for innovation” |

## Governance as design

Who may send prompts and datasets to an external model? That is a **policy and logging** design, same family as DLP and CASB. Residency, retention, and who can decrypt training sets belong in the HLD—not in a footnote after GPUs ship.

## Real-world — manufacturing predictive maintenance

**Business:** Train vibration models on plant historian data; run inference on-prem so a WAN cut does not stop the line.

| R / C / A | Statement |
|---|---|
| R | Inference RTO: line keeps running if Internet is down |
| R | Training data stays in-country (sovereignty) |
| C | OT VLAN cannot be flooded by IT training jobs |
| C | Plant has 1 Gbps DIA; campus has 100 Gbps DC fabric |
| A | “We will train in public cloud” — legal has not approved |

```text
Plant OT (inference appliance) -- air-gap-ish FW -- IT DMZ
                                      |
DC GPU pod (training) <=== dataset sync (scheduled, inspected)
                                      |
                              Public LLM SaaS (blocked for OT data)
```

**Decision:** Train in regional DC; push models to plant; block OT data to external LLM. Residual: model freshness depends on sync window (accepted).

## Real-world — retail demand-forecast SaaS

**Wanted:** Send all POS and loyalty data to an external ML SaaS for next-day forecasts.

**Rewrite with R/C/A:**

| Letter | Statement |
|---|---|
| R | Forecast job completes by 05:00 local; stores open with yesterday’s plan if SaaS fails |
| C | PCI and loyalty PII cannot leave approved region |
| A | SaaS “anonymizes” — must be contractually verified |

**Network design:** Tokenized/aggregated export path via DLP proxy; stores do **not** depend on SaaS for checkout; failure mode is stale forecast, not dark registers.

## Design checklist

1. Is the job train, infer, or SaaS—or a mix with different paths?
2. Where does data live, and what must never cross which boundary?
3. What is the RTO if the AI path dies—does production stop?
4. Is fabric ROI measured in job time / GPU busy time?
5. Are prompt/dataset egress controls as explicit as VRF tables?

## Risks

- Oversubscribing east-west and blaming “the AI software.”
- Stretching L2 between GPU and storage clusters across buildings/DCs.
- Treating Internet edge capacity as the AI bottleneck.
- Uncontrolled SaaS egress of regulated or proprietary data.
- Fate-sharing OT/production with experimental training VLANs.

## Interview framing

“AI/ML changes data gravity, east-west, and governance. I design the fabric and the policy boundary for the job type—not a bigger Internet circuit with ‘AI’ in the title.”

## Related

- [AI fabric design notes](../14_Data_Center_and_Cloud/05_AI_Fabric_Design_Notes.md)
- [Data sovereignty and governance](07_Data_Sovereignty_and_Governance.md)
- [Regulatory and AI security](../16_Security_Design/05_Regulatory_and_AI_Security.md)
- [Leaf-spine versus three-tier](../14_Data_Center_and_Cloud/01_Leaf_Spine_vs_Three_Tier.md)

---
