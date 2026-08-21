# RPO, RTO, ROI, and cost

Numbers beat adjectives. HA and cloud debates are cost and time debates in disguise. CCDE expects you to spend money on the **mechanism that hits the number**, not on the word “redundant.”

## Definitions

| Term | Meaning | Network implication |
|---|---|---|
| **RTO** | Time until service is usable again | Convergence, dual-homing, runbooks, people |
| **RPO** | How much data loss is acceptable | Replication design, sync vs async—not just “two firewalls” |
| **CAPEX** | Up-front spend | Owned circuits, chassis, licenses |
| **OPEX** | Ongoing spend | Cloud, managed SD-WAN, staff, power |
| **ROI** | Value vs spend over time | Do not gold-plate a branch that earns little |
| **TCO** | CAPEX + OPEX + failure cost over horizon | Include truck rolls and outage minutes |

RTO of 4 hours can be a cold spare and a runbook. RTO of 15 seconds is BFD, dual paths, and no fate sharing. Same word “redundant,” different design.

```text
Business: "highly available checkout"
Design ask: RTO=? RPO=? which failure events?
Without numbers → you are guessing spend
```

## RTO vs RPO — do not conflate

| Concern | Owns the number | Network levers |
|---|---|---|
| Service back online | RTO | Paths, FHRP, DNS TTL, runbook, staffing |
| Transactions / data not lost | RPO | Sync distance, storage, app commit design |
| Both | Continuity package | Dual DC alone does not fix async DB RPO |

A second firewall pair with RPO still measured in minutes of unsynced POS data has not met a “zero data loss” claim.

## Cost analysis habit

```text
Option A: second private circuit     high CAPEX, predictable latency
Option B: DIA + SD-WAN + cheap LTE   lower CAPEX, variable OPEX/quality
Option C: single path + 4h truck     low spend, RTO = hours
```

Pick from **RTO + application mix + staff skill**, not from a vendor slide. Voice and trading may justify A; guest Wi-Fi may not.

## Decision table — spend vs RTO class

| Target RTO | Typical network spend pattern | Poor fit |
|---|---|---|
| Hours | Cold spare, documented restore | Buying chassis pairs “just in case” |
| Minutes | Dual paths, FHRP, tested failover | Untested dual gear in one rack |
| Seconds | BFD, ECMP, no shared fate, practiced | Relying on default IGP timers alone |
| Near-zero loss (RPO) | Sync replication + distance limits | Stretching L2 and calling it HA |

## Real-world — healthcare radiology PACS

**Business:** Radiologists must read studies within 15 minutes of acquisition; legal retention is years.

| R / C / A | Statement |
|---|---|
| R | Primary site PACS RTO ≤ 15 min for read path |
| R | RPO ≤ 0 for finalized studies (no lost images) |
| C | Budget forbids three metro dark fibers this year |
| C | Storage team owns replication; network owns DCI |
| A | “DR site is warm” — currently untested quarterly |

```text
Hospital A (PACS primary) ==== sync DCI ==== Hospital B (warm)
        |                                      |
   Radiology clients                      Break-glass readers
```

**Design:** Sync DCI for study store (RPO); dual L3 DCI + DNS/GSLB for read path (RTO). Do **not** stretch the radiology VLAN—failure domain would couple both sites. Residual: async copy of older archive tiers with longer RPO accepted in writing.

## Real-world — university library Wi-Fi

**Claim:** “Same HA as the ERP.”

**Numbers:** Library Wi-Fi outage costs reputation; ERP outage stops payroll and enrollment.

| Service | Stated RTO | Justified spend |
|---|---|---|
| ERP / IdP | 15–30 min | Dual DC, dual WAN, practiced failover |
| Library Wi-Fi | 4 hours OK | Single controller N+1 local, DIA |

**ROI move:** Spend the second diverse circuit on IdP/ERP paths, not on guest SSID in the stacks. Same campus, different numbers.

## ROI traps

- Buying a chassis “for five years growth” when the business may exit the site in 18 months.
- Ignoring staff cost of a protocol nobody operates.
- Counting only circuit cost and not truck rolls or outage minutes.
- Treating cloud OPEX as “free HA” without measuring egress and failure modes.
- Meeting RTO on paper while RPO fails because the app was never in the network design conversation.

## Design checklist

1. Write RTO and RPO per **service**, not per “the network.”
2. Name the failure events those numbers apply to.
3. Map each number to a mechanism and a test.
4. Compare TCO including people and outage cost, not only CAPEX.

## Risks

- Adjective HA with no minutes attached.
- Dual everything in one failure domain (one room, one conduit).
- Optimizing CAPEX while exploding OPEX or skill debt.
- Network RTO met while application RPO is ignored.

## Interview framing

“I will not say highly available until I have RTO and RPO. Then I spend CAPEX or OPEX on the mechanism that actually hits those numbers.”

## Related

- [Business to technical mapping](01_Business_to_Technical_Mapping.md)
- [Risk, reward, and continuity](04_Risk_Reward_and_Continuity.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [FHRP, NSF, GR, BFD](../15_High_Availability_and_Scale/03_FHRP_NSF_GR_BFD.md)

---
