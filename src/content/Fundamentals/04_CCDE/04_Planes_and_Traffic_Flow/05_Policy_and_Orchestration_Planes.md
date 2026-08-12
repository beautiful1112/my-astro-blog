# Policy and orchestration planes

Campus SD-Access, ACI, and some electives add **policy** and **orchestration** as first-class planes. Treat them as extra control paths with their own fate.

## Extra planes

| Plane | Job |
|---|---|
| **Policy** | Group-based or contract intent (SGT, ACI contract, ZTNA) |
| **Orchestration** | Sequence of changes across compute, net, security (CI/CD, ITSM, controllers) |
| **Security** (when called out) | Enforcement and identity, not just encryption |

If policy lives only in human memory and tickets, you do not have a policy plane—you have hope.

## Design implications

- Policy plane availability: can a new user be authorized if ISE/IdP is down (fail open vs fail closed)? That is an RTO/security trade-off—write it.
- Orchestration that pushes 500 leafs without canaries is a **blast-radius** machine.
- Do not dual-write policy in firewall, SD-WAN, and SGT without a source of truth.

```text
Source of truth (repo / controller)
    -> CI validation
    -> staged rollout
    -> assurance loop (does state match intent?)
```

## Interview framing

“Policy and orchestration are planes with outage modes. I name the source of truth, fail-open vs fail-closed, and how a bad push is bounded.”

---
