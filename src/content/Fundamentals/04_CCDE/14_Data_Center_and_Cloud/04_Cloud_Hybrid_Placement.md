# Cloud and hybrid placement

Place the **workload** first (IaaS / PaaS / SaaS), then the network. CCDE-relevant themes: compliance, governance, connectivity, security, and increasingly AI/ML data paths. Hybrid that “just VPN everything to HQ” recreates a 2005 WAN with a cloud bill.

```text
Decide placement → decide data residency → decide path → decide inspection

On-prem  --  private interconnect / SD-WAN / IPsec  --  Cloud region(s)
                |                                     |
             SaaS access (Internet / SSE)         PaaS endpoints
```

## Placement questions (before routing diagrams)

| Question | If unclear |
|---|---|
| What must stay on-prem (latency, OT, data)? | Do not “cloud migrate” that class |
| What is SaaS (you only design access + identity)? | SSE/CASB, not a DC redesign |
| Where may data live (sovereignty)? | Region pin + contract controls |
| Who is the IdP—one or split? | Split is a security design |
| Egress: centralized inspect vs local? | Cost vs risk trade-off |

## Connectivity patterns

| Pattern | Use when | Risk |
|---|---|---|
| Central breakout via HQ | Strong inspect / DLP need | Hairpin latency, HQ SPOF |
| Local Internet + SSE | SaaS-heavy users | Need consistent policy |
| Private interconnect (DX/ER/etc.) | Steady high volume, compliance | Cost; region coupling |
| SD-WAN cloud on-ramp | Branch ↔ cloud apps | Underlay diversity still matters |
| Site-to-site IPsec only | Small / interim | Does not scale policy |

## Decision table — where does the app go?

| Class | Prefer | Network implication |
|---|---|---|
| Latency-sensitive OT / trading | On-prem / colocation | Deterministic path; careful cloud |
| Elastic web tier | Public cloud IaaS/PaaS | Autoscale + private + public ingress |
| Commodity SaaS | SaaS | Identity + SSE; minimize backhaul |
| Regulated data store | Region-locked cloud or on-prem | Logging location, encryption keys |
| AI training on sensitive corpora | Private GPU / VPC with controls | Egress lockdown to model APIs |

## Real-world — bank hybrid

**Facts:** Core banking on-prem, CRM SaaS, analytics in one cloud region, GDPR + local regulator, branches on SD-WAN.

**Design:**

- Keep core on-prem; private interconnect to cloud for analytics only
- SaaS via SSE with identity from corporate IdP; no hairpin of all SaaS via HQ
- Data residency: analytics region pinned; no second region without DPIA
- East-west cloud: native cloud networking + FW; not a stretched VLAN from DC
- OT/ATM networks never transitive to cloud without explicit broker

**Discarded:** Default route all branch traffic to HQ firewall then to cloud—latency and single point of failure.

## Real-world — software company (cloud-first)

**Facts:** Prod in two cloud regions, office users, little on-prem beyond IdP and a lab.

**Design:** Treat offices as campuses with Internet + ZTNA/SSE; interconnect regions with cloud backbone / private links; lab on-prem isolated. “Hybrid” is IdP + a few tools—not a full DC mirror.

## Design checklist

1. Workload classes listed with placement and data rules?
2. Identity path clear (one IdP vs federation)?
3. Inspection point per class (central, local, SSE)?
4. Failure: cloud region loss vs interconnect loss vs IdP loss?
5. AI/ML egress and training data controls explicit?

## Risks

- Hairpinning all cloud traffic through HQ “for security.”
- Stretching L2/DC subnets into cloud for “easy migration.”
- Ignoring data sovereignty until an audit fails.
- Dual IdP without a threat model (shadow admin paths).

## Interview framing

“I place data and apps by class, then I design connectivity and inspection. Hybrid is an enforceable split—not a tunnel to HQ for all clouds.”

## Related

- [Cloud OnRamp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)
- [DCI patterns](03_DCI_Patterns.md)
- [Data sovereignty and governance](../03_Business_Strategy/07_Data_Sovereignty_and_Governance.md)
- [Regulatory and AI security](../16_Security_Design/05_Regulatory_and_AI_Security.md)
- [Cloud removes network design? (misconception)](../22_Common_Misconceptions/04_Cloud_Removes_Network_Design.md)

---
