# Query bounding in design

EIGRP’s blast radius is the **query domain**. When a router loses its successor and has no feasible successor, it goes **Active** and Queries neighbors. If those neighbors query *their* neighbors, a missing prefix can wake the whole AS. Design the domain on purpose—or buy Stuck-in-Active (SIA).

Protocol mechanics: [EIGRP query scope](../../03_EIGRP/09_Query_Scope_and_Convergence/README.md), [stub overview](../../03_EIGRP/11_Stub_Filtering_and_Split_Horizon/01_EIGRP_Stub_Overview.md).

## Tools

| Tool | What it does for design |
|---|---|
| **Stub** | Spoke advertises limited route types; hubs **do not query** it as transit for remote enterprise prefixes |
| **Summary** | Query tends to stop at summarizer; hide specifics behind aggregate + Null0 |
| **Filter** | Surgical prefix control — not a substitute for leaf role |
| **Topology** | Dual hubs, no accidental spoke-spoke transit in the IGP |

```text
Spoke (eigrp stub) -- Hub-A -- summary 10.10.0.0/16 -- Core
                      Hub-B
Query for a spoke /32 dies at hub/summary — not 500 other spokes
```

## Real-world — DMVPN Phase 1 without stubs (failure)

**Facts:** 400 spokes, single hub, EIGRP over tunnels, no stub, no summary. Spoke WAN flap.

**What you see:** Hub CPU spike; spokes in Active; SIA; overnight brownout. Hub is both traffic and query concentration point.

**Repair:**

1. `eigrp stub connected summary` (or appropriate options) on **every** spoke.
2. Summarize spoke blocks at hub toward core; Null0 on hub.
3. Dual hubs with consistent stub/summary policy.
4. Consider SD-WAN/BGP for scale if still painful.

## Real-world — hub-and-spoke done right (manufacturing)

**Facts:** 120 plants, dual hubs in two regions, address plan `10.plant.0.0/16` per site.

| Knob | Setting |
|---|---|
| Spoke | Stub connected + summary; learn default or hub aggregates only |
| Hub | Summarize into core; do not redistribute plant specifics site-wide |
| Core | OSPF/IS-IS/BGP — not full EIGRP query domain |
| Link loss | FS on hub dual-path where possible; BFD on tunnels |

**Test:** Shut a spoke’s LAN prefix; confirm Queries do **not** appear on unrelated spokes (`debug`/`show ip eigrp topology active` scoped).

## Real-world — campus “stub on transit” mistake

**Facts:** Distribution layer marked stub “for safety” while it still needed to pass remote building prefixes between access blocks and core. After a core uplink failure, Access-A could not use Access-B’s alternate path through dist because stub limited what dist advertised and how queries were answered.

**Repair:** Stub only true leaves (access/WAN spokes). Dist/core stay query-capable transit; bound the domain with **summaries at building edges**, not stub on the device that must transit.

## Decision table

| Topology | Stub? | Summary where? |
|---|---|---|
| Classic DMVPN/SD-WAN spoke | Yes | Hub toward core |
| Campus access leaf | Often yes | Dist/core |
| Dual-homed WAN that must transit between hubs | Usually still stub; advertise connected/summary only — do not make spoke a transit DV | Hubs |
| Core/transit | No | Edges of domains |
| Dist that must pass remote buildings | No (not stub) | Summarize at building/dist edge |

## Richer decision table — symptom → design fix

| Symptom | Likely gap | Fix |
|---|---|---|
| SIA after one spoke flap | No stub / huge query domain | Stub all spokes; summarize at hub |
| Blackhole for hole in aggregate | Summary without Null0 | Add Null0 discard for aggregate |
| Lost alternate after uplink fail | Stub on transit node | Remove stub from transit; keep summaries |
| Hub CPU melts on every flap | Hub is query + traffic SPOF | Dual hubs; bound queries; consider BGP at scale |
| Full BGP table in EIGRP | Bad redistribution | Keep BGP at edge; never dump Internet into EIGRP |

## Design anti-patterns

| Anti-pattern | Result |
|---|---|
| Flat EIGRP AS, no stub, 1000+ routers | Classic SIA factory |
| Stub on a **transit** distribution that must pass remote routes | Lost alternate paths; surprise Active |
| Summary without Null0 | Blackhole for holes in aggregate |
| Redistributing BGP full table into EIGRP | Query + prefix death spiral |

## Verification / proof

| Test | Pass criteria |
|---|---|
| Shut spoke LAN prefix | Unrelated spokes show **no** Active for that prefix |
| Flap spoke tunnel | Hub CPU stays within budget; no campus-wide SIA |
| Withdraw specifics behind summary | Aggregate + Null0 prevents blackhole loops |
| Inventory | Every spoke has stub; no “temporary” non-stub spoke left |

## Interview framing

“Every EIGRP WAN I design has stubs on spokes and summaries at hubs. The query domain is a first-class failure domain—same importance as the L2 flood domain.”

## Related

- [EIGRP as enterprise IGP](01_EIGRP_as_Enterprise_IGP.md)
- [Hub-spoke versus mesh](../06_Routing_Protocol_Selection/05_Hub_Spoke_vs_Mesh.md)
- [Case: WAN hub SPOF](../19_Practical_Cases/02_WAN_Hub_SPOF.md)

---
