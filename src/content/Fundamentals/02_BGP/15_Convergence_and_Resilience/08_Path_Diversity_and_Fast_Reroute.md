# Path Diversity and Fast Reroute

Fast recovery needs **early failure detection** and a **usable alternate path**. Either alone is insufficient: BFD with one path still blackholes; dual paths with 180s Hold Timers still lose traffic for minutes.

## How diversity is lost

| Failure | Example |
|---|---|
| RR path hiding | Only best path reflected |
| Policy | Backup rejected by filter / LOCAL_PREF |
| Shared fate | Two peers on same fiber, DWDM, or power domain |
| Recursive dependency | Backup BGP NH via failed IGP link |
| Overlay illusion | Two VTEPs on one leaf pair |

## Control-plane diversity tools

| Tool | Role |
|---|---|
| **ADD-PATH** | Advertise multiple BGP paths |
| Diverse RRs / ORR | Different viewpoints |
| BGP multipath | Install several next hops |
| PIC / FRR | Preprogram backup forwarding |
| Separate ASes / uplinks | Independent Internet exits |

## Physical / failure-domain diversity

Label each session by:

- fiber / conduit / carrier;
- IX fabric / patch panel;
- PE / line card / power zone;
- city / metro.

Two BGP sessions are **not** automatically redundant. For quantitative trading sites, treat failure-domain labeling as mandatory design review.

## Design pattern

```text
Detection (BFD)
   + Diversity (ADD-PATH / dual RR / dual uplink)
   + Preinstall (PIC / multipath)
   + Planned drain (graceful shutdown)
```

## Configuration reminders

```text
! ensure backup path exists
neighbor 192.0.2.1 additional-paths receive
maximum-paths 2
! BFD on both uplinks
! verify not same IGP SRLG
```

## Verification

```text
show bgp ipv4 unicast <prefix>
! ≥2 paths, different NH
show ip route <prefix>
show cef <prefix> detail
! pull primary circuit; confirm failover domain independence
```

Map traceroute hops to shared risk groups after failover.

## Interactions

| Mechanism | Relationship |
|---|---|
| **Path hiding** | [13/03](../13_Route_Reflection_and_Confederations/03_Path_Hiding.md) |
| **PIC** | [07](07_Prefix_Independent_Convergence.md) |
| **BFD** | [02](02_Failure_Detection_and_BFD.md) |
| **AIGP** | May steer which diverse path wins—[AIGP](../08_Path_Attributes/11_AIGP.md) |

## Interview framing

“FRR needs both fast detection and true diversity—ADD-PATH and multipath create control-plane backups, but shared physical fate still collapses them.”

---
