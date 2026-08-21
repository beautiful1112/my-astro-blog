# CI/CD for the network

Network CI/CD means **validate, then push in small batches, with rollback**—not a Friday root script and hope. CCDE v3.1 expects awareness of **when** pipelines, IaC, and canaries fit constraints—not CCIE-level coding.

## Pipeline sketch

```text
Intent repo (Git)
    -> lint / schema / peer review
    -> simulate / dig / batfish / lab twin (as available)
    -> canary site / building / VRF
    -> gated promote to next wave
    -> assurance (intent vs state)
    -> rollback job ready before promote
```

| Stage | Purpose | Failure action |
|---|---|---|
| Lint / review | Catch syntax and policy smell | Block merge |
| Simulate / lab | Catch routing/policy blast | Block promote |
| Canary | Limit blast radius | Auto or human rollback |
| Wave promote | Match Agile vs change window | Pause on error budget |
| Assurance | Prove intent | Ticket + rollback |

## Blast radius is a first-class requirement

A pipeline that hits 2,000 sites at once is a **weapon**. Match change size to:

- Change window and freeze calendar
- Risk class (guest SSID vs PCI VRF)
- Observation delay (telemetry lag)

```text
Bad:  ansible all_branches.yml  # Friday 16:00
Good: wave0 lab → wave1 5 stores → wave2 region → rest
      rollback = prior artifact + known-good template
```

## Real-world — global ACL push

**Intent:** Block a threat IOC everywhere “in minutes.”

**What happened:** Typo in object-group; pipeline parallelized to all edges; remote access and partner VPN died globally; rollback slow because no prior artifact pinned.

**Repair:** Mandatory canary; object lint; change classes (emergency allow-list vs broad deny); rollback tested quarterly; human approval for deny-all patterns.

## Real-world — “Agile” vs network freeze

**Business:** Product teams ship daily.

**Network:** Quarterly change windows only for core.

**Design:** Separate pipelines—app-facing LB/cloud SG can move faster; core IGP/BGP and PCI FW stay gated. Do not pretend one cadence fits all planes.

## Tooling awareness (not a shopping list)

| Tool class | Use when | Not a substitute for |
|---|---|---|
| Git + review | Source of truth for intent | Understanding blast radius |
| Ansible / Terraform / Nornir | Repeatable push | Good design of what to push |
| Jenkins / GitLab CI | Orchestrate gates | Skipping peer review |
| Simulator / digital twin | Pre-prod confidence | Production canary |

## Rollback and success criteria

Define **before** the push:

- Numeric success: error rate, adjacency count, synthetic probe SLA, ticket spike threshold
- Time box: if not green in N minutes → rollback
- Owner: who runs rollback at 02:00

## Risks

- Automation without staging (faster outages).
- Secrets in repos; shared superuser keys for pipelines.
- Canary that is not representative (only lab switches).
- Measuring “job success” (SSH OK) instead of **service** success.

## Interview framing

“Network CI/CD is small validated pushes with rollback and canaries. A global play without a brake is not automation—it is a faster outage. I match wave size to the failure domain I am willing to burn.”

## Related

- [Controller-based design](01_Controller_Based_Design.md)
- [APIs and model-driven](02_APIs_and_Model_Driven.md)
- [Visibility, observability, assurance](04_Visibility_Observability_Assurance.md)
- [Waterfall versus Agile](../03_Business_Strategy/02_Waterfall_vs_Agile.md)
- [Implementation and migration plans](../18_Migration_and_Practical_Method/01_Implementation_and_Migration_Plans.md)

---
