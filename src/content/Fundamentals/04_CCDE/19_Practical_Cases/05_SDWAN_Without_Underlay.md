# Case: SD-WAN without underlay

## Context

Retail chain replaced dual MPLS with SD-WAN to cut cost. Design sold as “HA via overlay.” Each store got **one** DIA Ethernet circuit; LTE “for later.” Controllers hosted in a single public cloud region. App SLA classes defined for POS and voice. Marketing announced five-nines WAN.

## Incident

Weekday afternoon: metro fiber cut affected ~40 stores on the same last-mile provider (shared conduit to a mall cluster). Overlay had nowhere to go. Voice calls dropped; POS store-and-forward kicked in with gaps; cellular boosters absent. Same quarter: controller region impairment blocked ZTP for three new store openings and delayed a security template; some edges with aggressive freshness checks failed closed on policy refresh. Executives asked why “SD-WAN HA” failed twice differently (path vs control).

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Voice recover ≤30 s on primary underlay loss (critical stores) |
| R2 | Req | POS continue or store-and-forward with known RPO |
| R3 | Req | Open ≥20 stores/month (ZTP dependency) |
| C1 | Constr | MPLS removal target for cost; LTE OPEX scrutinized |
| C2 | Constr | Small WAN team; vendor-led design workshop |
| C3 | Constr | Landlord restricts antenna/LTE at some sites |
| A1 | Assum (bad) | SD-WAN provides HA by itself |
| A2 | Assum (bad) | One DIA + overlay encryption = dual-path resilience |
| A3 | Assum (bad) | Controller in one region is fine if devices already onboarded |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | Second underlay (LTE or DIA2) on critical/all stores; multi-region controller; last-known-forward | **Strategic — pick** |
| B | QoS only on the single circuit | Reject for R1 — helps mice vs elephants, not cut fiber |
| C | Keep/reintroduce MPLS as second underlay for critical class | Valid hybrid if LTE blocked |
| D | Move controllers only; keep single DIA | Incomplete — fixes change plane, not path RTO |
| E | Immediate: LTE kits to top-N revenue stores; relax fail-closed refresh | **Immediate** |

## What “good” looks like after

```text
Store edge
  DIA  ──┐
  LTE  ──┼── SD-WAN edge === overlay === dual hubs / cloud gateways
 (DIA2) ─┘        |
                  +-- last-known policy if controller unreachable
                  +-- SLA probes per transport (brownout detect)

Controllers: cluster members in region A + B (+ OOB reach)
Underlay survey: entrance / conduit / provider diversity documented
```

Design statements to write in HLD:

- Overlay policy **cannot invent a second photon**.
- Brownout detection per TLOC, not only hard down.
- Controller RTO for **change/ZTP** vs **forwarding** called out separately.
- Landlord LTE constraints → alternate DIA ISP or accept longer RTO.

## Metrics / proof

| Test | Pass criteria |
|---|---|---|
| Unplug DIA at pilot store | Voice MOS path on LTE within 30 s |
| Police DIA to 10% (brownout) | App steer moves POS/voice class |
| Block controller reachability | Existing sessions forward; alert on change freeze |
| Fiber cut tabletop (mall conduit) | Stores with dual underlay survive; single-DIA list has accepted RTO |
| New store ZTP during region A loss | Onboard via region B or delayed with exec-accepted backlog |

## Two failures, one lesson

| Failure | Missing domain split | Overlay alone? |
|---|---|---|
| Fiber cut / shared conduit | Underlay diversity | No |
| Controller region impairment | Control/change plane HA + last-known-forward | No |

Same product, two different fate domains—both must appear on the HA slide.

## CCDE takeaway

SD-WAN is overlay intent on **diverse underlays** plus an explicit controller fate story. Single-circuit SD-WAN is cost optimization with a marketing HA sticker. Design photons first, templates second.

## Related

- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [Controller-based design](../17_Automation_and_Observability/01_Controller_Based_Design.md)
- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [RTO/RPO to HA mapping](../15_High_Availability_and_Scale/02_RTO_RPO_to_HA_Mapping.md)
- [Case: WAN hub SPOF](02_WAN_Hub_SPOF.md)

---
