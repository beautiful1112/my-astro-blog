# Case: WAN hub as single point of failure

## Context

Regional logistics company: ~180 branches, DMVPN/SD-WAN style hub-and-spoke for corp apps, voice handsets at docks, SaaS WMS in public cloud. Primary hub in DC-A (owned colo). “Secondary hub” added after an audit checkbox for HA. Spokes learned defaults and corp summaries only from hubs; little local Internet breakout except guest Wi-Fi.

## Incident

Saturday 02:14 — DC-A cooling failure escalated to orderly power shed. Both hub routers and the virtual “Hub-B” (same SAN, same room) went dark. Spokes kept trying hub tunnels; corp routing withdrawn; voice registration to HQ CUCM failed; WMS SaaS still reachable on the Internet but branches had no path because traffic hairpinned to the dead hub. Dock operations stalled across the region. Partial recovery began ~04:40 when emergency power returned; full routing/policy settle ~06:10. Business impact ~4 hours peak season.

## R/C/A (reconstructed)

| ID | Type | Text |
|---|---|---|
| R1 | Req | Branches survive loss of DC-A for ≥4 hours (SaaS WMS + dock voice) |
| R2 | Req | Corp file/print may degrade but must not brick SaaS |
| R3 | Req | New branch turn-up < 2 days |
| C1 | Constr | Capex aversion; “HA pair” funded as VMs preferred |
| C2 | Constr | Internet DIA present at most sites; LTE only at 30 critical docks |
| C3 | Constr | Single WAN team of three |
| A1 | Assum (bad) | Two hub routers = two sites |
| A2 | Assum (bad) | Hairpinning SaaS through HQ is “more secure” and still HA |
| A3 | Assum (bad) | Virtual Hub-B on same SAN is geographic diversity |

## Options considered

| Option | Description | Verdict |
|---|---|---|
| A | Dual **independent** hubs (DC-A + DC-B or cloud region), spokes stubbed, DIA/SASE for SaaS/voice as needed | **Strategic — pick** |
| B | Bigger UPS / generator at DC-A only | Reject for R1 — lengthens MTTF, does not meet site-loss RTO |
| C | Keep single hub; add more spoke timers / QoS | Reject — cannot invent a path |
| D | Full mesh IPsec between all spokes | Reject — ops scale; still need underlay; weak vs DIA SaaS goal |
| E | Immediate: local DIA default for SaaS + DNS; emergency LTE on critical docks | **Immediate mitigation** |

## What “good” looks like after

```text
                    [Controller cluster: region E + W]
                              |
         Hub-East (site E)           Hub-West (site W)
         dual underlay               dual underlay
              \                         /
               \                       /
                +----- overlay -------+
                        |
        Spoke: TLOC preference Hub-E / Hub-W
               + local DIA (or SASE) for WMS/SaaS
               + LTE on critical docks
               + stub: no dependency on dead hub for Internet
```

- Hub-B is a **second site** (or second cloud region), not a twin VM.
- Spokes do not require hub transit for allow-listed SaaS.
- OOB/LTE path to bring hubs and controllers back under duress.

## Metrics / proof

| Test | Pass criteria |
|---|---|
| Power-off Hub-East (maint window) | Spokes re-home < RTO; WMS HTTPS synthetic green via DIA |
| Withdraw Hub-East prefixes | No blackhole of 0/0 toward corpse; probe loss budget met |
| Tabletop DC-A site loss | Voice critical docks on LTE path documented |
| Inventory | Hub-B not on Hub-A SAN/PDU; written power domains |
| Change | Hub upgrades staged E then W, never one play |

## Timeline (abridged)

| Time | Event |
|---|---|
| 02:14 | Cooling alarm DC-A; power shed begins |
| 02:22 | Both hubs unreachable; spoke tunnels down |
| 02:35 | WMS SaaS up from phones; stores cannot route via hub |
| 04:40 | Emergency power; hub boots |
| 06:10 | Routing/policy settled; backlog clear |

## CCDE takeaway

Hub fate is a **site and power domain**, not a second logo. Stub spokes and local breakout so Internet/SaaS survival does not require a living HQ. If budget buys only a hotter UPS, **lengthen RTO in writing**—do not ship a fake HA story.

## Related

- [Fate sharing](../15_High_Availability_and_Scale/04_Fate_Sharing.md)
- [Failure domains](../15_High_Availability_and_Scale/01_Failure_Domains.md)
- [WAN topologies](../13_Campus_WAN_and_Edge/02_WAN_Topologies.md)
- [SD-WAN design](../13_Campus_WAN_and_Edge/03_SD_WAN_Design.md)
- [RTO/RPO to HA mapping](../15_High_Availability_and_Scale/02_RTO_RPO_to_HA_Mapping.md)

---
