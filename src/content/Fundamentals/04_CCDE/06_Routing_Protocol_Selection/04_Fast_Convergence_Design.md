# Fast convergence design

Fast convergence is an **RTO budget** problem: detect → withdraw/compute → FIB install → (optionally) repair path. Buying only “faster timers” without dual paths or bounded domains often creates instability.

## Convergence budget

```text
Fault → Detection → Control reaction → FIB → Traffic OK
         BFD/carrier     SPF/DUAL/BGP    HW
```

| Piece | Design knobs |
|---|---|
| Detection | Carrier-delay, BFD, LOS |
| Local repair | LFA/TI-LFA, ECMP, precomputed |
| Global reconverge | IGP/BGP timers, prioritization |
| Domain size | Summaries, stubs, RR placement |

## Layered approach

| Layer | Intent |
|---|---|
| Dual diverse paths | Survive without heroics |
| Local FRR | Sub-50–100 ms where required |
| Tuned IGP | Seconds, not minutes |
| BGP | Often slower; do not pretend otherwise without design |
| Overlay | May hide or complicate underlay events |

## When not to crank timers

- Unstable radio/microwave edges → dampen / stub / summary instead.
- Huge LSDB → fix hierarchy first.
- Single CPE uplink → BFD cannot invent a second path.

## Real-world — voice over dual MPLS WAN

**Brief:** Voice RTO 1 s preferred; hubs dual PE; spokes single MPLS + LTE backup; prior outage from aggressive OSPF timers on flappy spokes.

| R / C / A | Statement |
|---|---|
| R | Hub-hub and hub-region voice survives PE loss <1 s |
| C | Spoke radios flap in storms; LTE is best-effort |
| A | “BFD 50 ms everywhere” is uniformly good — false |

**Decision:** Aggressive BFD/FRR on hub and stable metro; spoke detection moderate; stub spokes; LTE as last resort with QoS. Reject global micro-BFD on flappy links.

## Technology map (design view)

| Tool | Role |
|---|---|
| BFD | Fast detect |
| LFA / TI-LFA / SR FRR | Local repair |
| ECMP | Instant alternate if fate-diverse |
| NSF/GR | Control restart without full data hit |
| FHRP + tracking | First-hop; not a WAN FRR substitute |

## Risks

- Microtimers causing control-plane meltdown.
- Fast detect into a non-diverse “alternate.”
- Ignoring BGP/overlay on the critical user path.

## Interview framing

“I design convergence as a budget: diversity first, then detection and local repair, and I refuse aggressive timers on unstable edges.”

## Related

- [FHRP, NSF, GR, BFD](../15_High_Availability_and_Scale/03_FHRP_NSF_GR_BFD.md)
- [Hub-spoke versus mesh](05_Hub_Spoke_vs_Mesh.md)
- [RPO, RTO, ROI, and cost](../03_Business_Strategy/03_RPO_RTO_ROI_and_Cost.md)

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

---
