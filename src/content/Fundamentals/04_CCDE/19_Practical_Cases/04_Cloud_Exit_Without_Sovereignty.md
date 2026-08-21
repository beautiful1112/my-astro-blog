# Case: cloud exit without sovereignty

## Context

EU-headquartered insurer with branches in DE, FR, NL. Global SD-WAN rollout used a single template: SaaS OnRamp / DIA breakout to “nearest” cloud security and vendor region for productivity suite and claims portal. Latency looked excellent in pilots from Frankfurt. Legal classified certain claims PII as **in-region only** (GDPR + internal policy). Contract with SaaS vendor included an EU processing region.

## Incident

Three months after global template: DLP/CASB report showed class-PII flows to a US SaaS region via the “optimal” OnRamp path (DNS + anycast steering favored US POP under load/maintenance). No classic “outage”—users were happy. Legal issued **stop-ship** on further DIA expansion; regulator notification discussion opened. Network team was blamed for “breaking GDPR” though they had optimized for latency and cost.

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Class-PII processed/stored only in approved EU regions |
| R2 | Req | Branch UX for non-PII SaaS remains acceptable (latency budget) |
| R3 | Req | Central visibility of SaaS destinations (CASB/SWG logs) |
| C1 | Constr | SaaS vendor offers EU region; US region also live on same tenant unless pinned |
| C2 | Constr | Global SD-WAN template owned by central NOC (US-tz) |
| C3 | Constr | Some legacy apps still hairpin to EU DC |
| A1 | Assum (bad) | “Cloud is anycast; location does not matter if encrypted” |
| A2 | Assum (bad) | Lowest latency path is always the compliant path |
| A3 | Assum (bad) | Encryption satisfies residency |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | Pin EU sites to EU SaaS region; DNS/CASB controls; block US destinations for PII class; region-specific SD-WAN templates | **Strategic — pick** |
| B | Encrypt more / bigger IPsec and hope | Reject — jurisdiction ≠ confidentiality |
| C | Force all SaaS hairpin to EU DC FW | Possible interim; UX/cost hit; still need destination control |
| D | Disable DIA; full tunnel only | Heavy-handed; may still reach wrong region if DNS wrong |
| E | Immediate: CASB block US region for PII apps; freeze template | **Immediate** |

## What “good” looks like after

```text
EU branch
  DIA/SASE -- policy: PII apps -> eu-central endpoints only
           -- DNS views / private DNS for tenant
           -- CASB: deny *.us-region.* for class PII
  SD-WAN template: EU-residency (not global-default)

Non-PII / public content: may use broader breakout
Audit: logs prove destination region, not only "HTTPS allowed"
```

Controls that matter:

- **DNS and OnRamp steering** as data-location controls
- Per-region SD-WAN / SASE policy packs
- Contractual tenant pinning + technical deny as belt-and-suspenders
- Separate templates for EU vs other geos

## Metrics / proof

| Test | Pass criteria |
|---|---|---|
| CASB/SWG report 30 days | Zero class-PII to non-EU regions |
| DNS resolution from EU branch | PII app names → EU endpoints only |
| Failure injection (US POP preferred by anycast) | Policy still denies; user gets EU or fail closed |
| Template review | No global-default OnRamp for PII app list |
| Legal sign-off | Written mapping R1 → controls |

## Why latency optimization lied

Anycast and “nearest POP” optimize for RTT and load, not for **processing jurisdiction**. A US POP can win during EU region maintenance even when an EU contract exists. Without DNS views, destination allow-lists, and CASB denies, the network will happily pick the illegal winner.

## CCDE takeaway

Fast and legal are different requirements. On-ramp, DNS, and templates are **sovereignty enforcement points**. Encryption does not move processing jurisdiction. Pin regions on purpose; do not let latency optimization silently violate residency.

## Related

- [Cloud OnRamp](../13_Campus_WAN_and_Edge/05_Cloud_OnRamp.md)
- [Regulatory and AI security](../16_Security_Design/05_Regulatory_and_AI_Security.md)
- [Cloud hybrid placement](../14_Data_Center_and_Cloud/04_Cloud_Hybrid_Placement.md)
- [Policy enforcement points](../16_Security_Design/04_Policy_Enforcement_Points.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)

---
