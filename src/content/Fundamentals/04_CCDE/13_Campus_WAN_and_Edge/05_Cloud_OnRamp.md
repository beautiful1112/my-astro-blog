# Cloud on-ramp

Cloud on-ramp is how campus/WAN/DC traffic **enters cloud networks safely and predictably**: path, identity, security, and sovereignty included.

## Pattern catalog

| Pattern | Description | Watch |
|---|---|---|
| Internet to SaaS | DIA + SSE/SASE | Visibility, DNS |
| IPsec to VPC/VNet | Classic | Scale of tunnels |
| Private peering / interconnect | Dedicated | Region lock-in |
| SD-WAN cloud gateway | Vendor on-ramp | Underlay dependency |
| Transit via DC hub | Hairpin | Latency, SPOF |

```text
Branch -- SD-WAN/DIA --> Cloud edge / SSE --> SaaS
Branch -- private --> DC hub --> Interconnect --> IaaS
```

## Design questions

1. Which apps are SaaS vs IaaS?
2. Must traffic inspect centrally?
3. Residency constraints?
4. Single region or multi-region fail?
5. Who owns DNS and identity path?

## Real-world — insurer hybrid

**Brief:** Claims app in two cloud regions; agents on SD-WAN; regulators require in-country processing; prior design hairpinned all cloud via one DC.

| R / C / A | Statement |
|---|---|
| R | Agent RTT to claims <80 ms; data stays in-country |
| C | One interconnect pair in-country; DC hairpin adds 40 ms |
| A | “Hairpin is simpler and just as good” — fails RTT |

**Decision:** Regional SD-WAN on-ramp / private interconnect in-country; keep security via cloud FW/SSE with logging locality. Reject mandatory global DC hairpin.

## Security coupling

| Need | On-ramp implication |
|---|---|
| CASB/SSE | Prefer DIA + SSE for SaaS |
| Heavy east-west IaaS | Private path + cloud segmentation |
| PCI | Explicit VRF/path + PEP |

## Risks

- Shadow IT DIA bypassing controls.
- On-ramp SPOF in one AZ/region.
- Ignoring return path and DNS.

## Interview framing

“On-ramp is a path and control design: I match SaaS vs IaaS patterns, honor sovereignty, and refuse silent hairpins that break latency or residency.”

## Related

- [Internet edge and multihoming](04_Internet_Edge_and_Multihoming.md)
- [Cloud hybrid placement](../14_Data_Center_and_Cloud/04_Cloud_Hybrid_Placement.md)
- [Data sovereignty and governance](../03_Business_Strategy/07_Data_Sovereignty_and_Governance.md)

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
## Micro-scenario (second pass)

**Brief:** Constraints tighten mid-project (budget cut, skill loss, or regulator letter).

| R / C / A | Statement |
|---|---|
| R | Preserve the original outcome metric |
| C | New hard limit appears |
| A | “Keep the old HLD unchanged” — usually false |

**Move:** Re-open only the decisions that the new constraint touches; keep invariants that still fit. Document what you demote from requirement to wish.

## One-page defense skeleton

```text
Outcome (R#)
Choice (one sentence)
Loser (one sentence)
Spend (cost/complexity/suboptimal)
Residual risk
Proof (test/KPI)
```

---
