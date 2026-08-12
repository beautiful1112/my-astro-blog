# RPO, RTO, ROI, and cost

Numbers beat adjectives. HA and cloud debates are cost and time debates in disguise.

## Definitions

| Term | Meaning | Network implication |
|---|---|---|
| **RTO** | Time until service is usable again | Convergence, dual-homing, runbooks, people |
| **RPO** | How much data loss is acceptable | Replication design, sync vs async, not just “two firewalls” |
| **CAPEX** | Up-front spend | Owned circuits, chassis, licenses |
| **OPEX** | Ongoing spend | Cloud, managed SD-WAN, staff, power |
| **ROI** | Value vs spend over time | Do not gold-plate a branch that earns little |

RTO of 4 hours can be a cold spare and a runbook. RTO of 15 seconds is BFD, dual paths, and no fate sharing. Same word “redundant,” different design.

## Cost analysis habit

```text
Option A: second private circuit     high CAPEX, predictable
Option B: DIA + SD-WAN + cheap LTE   lower CAPEX, variable OPEX/quality
```

Pick from **RTO + application mix + staff skill**, not from a vendor slide. Voice and trading may justify A; guest Wi-Fi may not.

## ROI traps

- Buying a chassis “for five years growth” when the business may exit the site in 18 months.
- Ignoring staff cost of a protocol nobody operates.
- Counting only circuit cost and not truck rolls or outage minutes.

## Interview framing

“I will not say highly available until I have RTO and RPO. Then I spend CAPEX or OPEX on the mechanism that actually hits those numbers.”

---
