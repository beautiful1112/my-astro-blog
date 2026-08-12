# Cloud and hybrid placement

Place the **workload** first (IaaS/PaaS/SaaS), then the network. CCDE domain 4.2: compliance, governance, connectivity, security, AI/ML.

Questions:

- What must stay on-prem (latency, data, OT)?
- What is SaaS (you only design access and CASB/identity)?
- Egress: centralized inspect vs local?
- Identity: one IdP or split? Split is a security design.

Hybrid that “just VPN everything to HQ” recreates a 2005 WAN with a cloud bill.

## Interview framing

“I place data and apps by class, then I design connectivity and inspection. Hybrid is an enforceable split, not a tunnel to HQ for all clouds.”

---
