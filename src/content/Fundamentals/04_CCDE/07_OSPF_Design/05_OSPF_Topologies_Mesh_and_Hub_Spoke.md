# OSPF topologies: mesh and hub-spoke

OSPF runs on many physical topologies; the **area and adjacency design** must match hub-spoke versus mesh realities or you inherit unnecessary LSDB and fragile transit.

## Topology ↔ OSPF mapping

| Physical | OSPF habit |
|---|---|
| Campus partial mesh | Multi-area; building areas; dual ABR |
| WAN hub-spoke | Spokes in stub/NSSA; hub in backbone or transit carefully |
| Full mesh core | Small area 0; avoid huge single area |
| NBMA / hub-spoke Layer-2 | Designated router placement matters |

```text
Hub-spoke WAN:
  Spoke (stub) -- Hub ABR -- Area 0 -- Hub ABR -- Spoke
Mesh campus core:
  Building areas around dual-attached area 0 triangle
```

## Hub-spoke pitfalls

| Pitfall | Better |
|---|---|
| Spokes as transit | Make stub; no backdoor |
| All spokes in area 0 | Areas + summary |
| Hub as single ABR SPOF | Dual hub/ABR |
| Redistribute spiral at hub | Tags + one-way / BGP seam |

## Mesh pitfalls

| Pitfall | Better |
|---|---|
| Everything area 0 | Introduce hierarchy early |
| Too many full adjacencies | Focused core; passive access |
| Virtual links as architecture | Redesign contiguous backbone |

## Real-world — energy company SCADA + IT

**Brief:** SCADA hub-spoke microwave; IT campus meshed; team runs one OSPF process flat; SCADA flaps hurt IT.

| R / C / A | Statement |
|---|---|
| R | SCADA flap contained; IT voice unaffected |
| C | Shared core routers today; split budget next FY |
| A | “One OSPF domain simplifies ops” — false here |

**Decision:** Separate areas (or processes/VRFs) for SCADA vs IT; SCADA spokes stub; dual hub. Reject flat area 0 across both.

## Virtual links

Treat as **migration bandage**, not target design. Contiguous area 0 is the architecture goal.

## Risks

- Area 0 discontiguous after a move.
- Hub-spoke without stub → spoke transit surprises.
- Mesh without summarization → scale cliff.

## Interview framing

“I map OSPF areas to the real hub-spoke or mesh topology—stubs at spokes, contiguous backbone, and no virtual-link-as-architecture.”

## Related

- [OSPF area design](01_OSPF_Area_Design.md)
- [Hub-spoke versus mesh](../06_Routing_Protocol_Selection/05_Hub_Spoke_vs_Mesh.md)
- [Stub and NSSA as design tools](03_Stub_NSSA_as_Design_Tools.md)

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
