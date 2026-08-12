# Hub-spoke versus mesh

WAN and IGP topology must match **traffic and failure**, not a drawing aesthetic.

## Patterns

| Topology | Traffic fit | Control-plane risk |
|---|---|---|
| Hub-spoke | Branch-to-DC, little branch-branch | Hub is SPOF; spoke should be stub/non-transit |
| Partial mesh | Regional communities | More circuits, still bounded |
| Full mesh | Any-to-any, small N | Session/LSDB explosion as N grows |
| Overlay on any | Policy-defined | Underlay still hub-spoke physically |

```text
Spokes -- do not transit -- Hub(s) -- Core
Dual hub: spokes dual-homed; avoid spoke-as-transit (EIGRP stub, OSPF spoke, BGP)
```

DMVPN/SD-WAN can offer **on-demand spoke-spoke** while remaining hub-and-spoke operationally. That is a traffic engineering choice: save hub hairpin vs lose central inspection.

## Interview framing

“I match topology to traffic. Hub-spoke gets stubs and dual hubs. Full mesh is for small N or a fabric underlay—not 2000 branches in one IGP.”

---
